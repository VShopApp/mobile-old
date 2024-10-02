import { Drawer } from "expo-router/drawer";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import { Platform, View } from "react-native";
import { DrawerItemList } from "@react-navigation/drawer";
import { Appbar, Text, useTheme } from "react-native-paper";
import * as Application from "expo-application";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import MediaPopup from "~/components/popups/MediaPopup";
import DonatePopup from "~/components/popups/DonatePopup";

function CustomDrawerContent(props: any) {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          paddingVertical: 20,
        }}
      >
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            marginRight: 10,
          }}
          source={require("~/assets/images/logo-50.png")}
        />
        <View>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>VShop</Text>
          <Text style={{ fontSize: 12 }}>
            v{Application.nativeApplicationVersion}
          </Text>
        </View>
      </View>
      <DrawerItemList {...props} />
    </>
  );
}

function Layout() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          header: ({ options, navigation }) => (
            <Appbar.Header style={{ backgroundColor: colors.primary }}>
              <Appbar.Action icon="menu" onPress={navigation.openDrawer} />
              <Appbar.Content title={options.title} />
            </Appbar.Header>
          ),
        }}
      >
        <Drawer.Screen
          name="bundles"
          options={{
            title: t("bundles"),
            drawerIcon: ({ color, size }) => (
              <Icon name="package" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="shop"
          options={{
            title: t("shop"),
            drawerIcon: ({ color, size }) => (
              <Icon name="basket" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="night_market"
          options={{
            title: t("nightmarket"),
            drawerIcon: ({ color, size }) => (
              <Icon name="weather-night" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            title: t("profile"),
            drawerIcon: ({ color, size }) => (
              <Icon name="account" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="gallery"
          options={{
            title: t("gallery"),
            drawerIcon: ({ color, size }) => (
              <Icon name="camera-burst" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: t("settings"),
            drawerIcon: ({ color, size }) => (
              <Icon name="cog" color={color} size={size} />
            ),
          }}
        />
      </Drawer>
      <MediaPopup />
      {Platform.OS === "android" && <DonatePopup />}
    </>
  );
}

export default Layout;
