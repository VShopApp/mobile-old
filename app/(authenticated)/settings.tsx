import React from "react";
import { Checkbox, List, Text, TouchableRipple } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Linking, ToastAndroid, ScrollView } from "react-native";
import CookieManager from "@react-native-cookies/cookies";
import { Platform } from "react-native";
import { useUserStore } from "~/hooks/useUserStore";
import { useFeatureStore } from "~/hooks/useFeatureStore";
import { useDonatePopupStore } from "~/components/popups/DonatePopup";
import { useWishlistStore } from "~/hooks/useWishlistStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { defaultUser } from "~/utils/valorant-api";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";

function Settings() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const { isDonator, screenshotModeEnabled, toggleScreenshotMode } =
    useFeatureStore();
  const { showDonatePopup } = useDonatePopupStore();
  const { notificationEnabled, setNotificationEnabled } = useWishlistStore();

  const handleLogout = async () => {
    await CookieManager.clearAll(true);
    await AsyncStorage.removeItem("region");
    setUser(defaultUser);
    router.replace("/setup");
  };

  // TODO: Use expo-background-fetch
  const toggleNotificationEnabled = async () => {
    if (isDonator) {
      const newValue = !notificationEnabled;
      if (newValue) {
        // const result = await requestNotifications(["alert"]);
        // if (result.status == RESULTS.GRANTED) {
        //   await messaging().subscribeToTopic("wishlist_timer");
        //   ToastAndroid.show(
        //     t("wishlist.notification.enabled"),
        //     ToastAndroid.LONG
        //   );
        //   setNotificationEnabled(newValue);
        // } else {
        //   ToastAndroid.show(
        //     t("wishlist.notification.no_permission"),
        //     ToastAndroid.LONG
        //   );
        // }
      } else {
        ToastAndroid.show(
          t("wishlist.notification.disabled"),
          ToastAndroid.LONG
        );
        setNotificationEnabled(newValue);
      }
    } else {
      showDonatePopup();
    }
  };

  const showLastExecution = async () => {
    const lastWishlistCheck = await AsyncStorage.getItem("lastWishlistCheck");
    const ms = Number.parseInt(lastWishlistCheck || "0");
    if (ms > 0) {
      const hours = Math.floor((new Date().getTime() - ms) / 1000 / 60 / 60);
      const minutes = Math.floor((new Date().getTime() - ms) / 1000 / 60);
      ToastAndroid.show(
        `Last checked: ${
          hours === 0 ? `${minutes} minutes` : `${hours} hours`
        } ago`,
        ToastAndroid.LONG
      );
    } else {
      ToastAndroid.show("Never checked", ToastAndroid.LONG);
    }
  };

  return (
    <ScrollView>
      <List.Section title={t("general")}>
        <TouchableRipple
          onPress={() => {
            router.navigate("/language");
          }}
        >
          <List.Item
            title={t("language")}
            left={(props) => <List.Icon {...props} icon="translate" />}
          />
        </TouchableRipple>
        {Platform.OS === "android" && (
          <>
            <TouchableRipple
              onPress={toggleNotificationEnabled}
              onLongPress={showLastExecution}
            >
              <List.Item
                title={t("wishlist.notification.name")}
                description={t("wishlist.notification.info")}
                left={(props) => (
                  <List.Icon {...props} icon="cellphone-message" />
                )}
                right={() => (
                  <Checkbox
                    status={notificationEnabled ? "checked" : "unchecked"}
                    onPress={toggleNotificationEnabled}
                  />
                )}
              />
            </TouchableRipple>
            <TouchableRipple disabled={isDonator} onPress={showDonatePopup}>
              <List.Item
                title={t("donate")}
                description={
                  isDonator && (
                    <Text style={{ color: "green" }}>
                      {t("donate_unlocked")}
                    </Text>
                  )
                }
                left={(props) => <List.Icon {...props} icon="hand-coin" />}
              />
            </TouchableRipple>
          </>
        )}
      </List.Section>
      <List.Section title={t("links")}>
        <TouchableRipple
          onPress={() => Linking.openURL("https://vshop.one/discord")}
        >
          <List.Item
            title={t("discord_server")}
            left={(props) => <List.Icon {...props} icon="link" />}
          />
        </TouchableRipple>
        <TouchableRipple
          onPress={() => Linking.openURL("https://vshop.one/credits")}
        >
          <List.Item
            title={t("credits")}
            left={(props) => <List.Icon {...props} icon="link" />}
          />
        </TouchableRipple>
        <TouchableRipple
          onPress={() => Linking.openURL("https://vshop.one/privacy")}
        >
          <List.Item
            title={t("privacy_policy")}
            left={(props) => <List.Icon {...props} icon="link" />}
          />
        </TouchableRipple>
        <TouchableRipple
          onPress={() =>
            Linking.openURL(
              "https://support-valorant.riotgames.com/hc/en-us/articles/360050328414-Deleting-Your-Riot-Account-and-All-Your-Data"
            )
          }
        >
          <List.Item
            title={t("delete_account")}
            left={(props) => <List.Icon {...props} icon="link" />}
          />
        </TouchableRipple>
      </List.Section>
      <List.Section title={t("account")}>
        <TouchableRipple onPress={() => Clipboard.setString(user.id)}>
          <List.Item
            title={t("copy_riot_id")}
            left={(props) => <List.Icon {...props} icon="content-copy" />}
          />
        </TouchableRipple>
        <TouchableRipple onPress={handleLogout}>
          <List.Item
            title={t("logout")}
            left={(props) => <List.Icon {...props} icon="logout" />}
          />
        </TouchableRipple>
      </List.Section>
      {__DEV__ && (
        <List.Section title="Development">
          <TouchableRipple onPress={toggleScreenshotMode}>
            <List.Item
              title={t("screenshot_mode")}
              left={(props) => (
                <List.Icon {...props} icon="cellphone-screenshot" />
              )}
              right={() => (
                <Checkbox
                  status={screenshotModeEnabled ? "checked" : "unchecked"}
                  onPress={toggleScreenshotMode}
                />
              )}
            />
          </TouchableRipple>
        </List.Section>
      )}

      <Text
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "gray",
          marginTop: 5,
          paddingHorizontal: 15,
        }}
      >
        {t("disclaimer")}
      </Text>
    </ScrollView>
  );
}

export default Settings;
