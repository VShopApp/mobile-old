import { getAccessTokenFromUri, getVAPILang, isSameDayUTC } from "./misc";
import {
  getEntitlementsToken,
  getShop,
  getUserId,
  loadVersion,
  reAuth,
} from "./valorant-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import i18n from "./localization";
import { checkDonator } from "./vshop-api";
import { useWishlistStore } from "~/hooks/useWishlistStore";
import * as Notifications from "expo-notifications";
import BackgroundFetch from "react-native-background-fetch";
import { posthog } from "~/components/Posthog";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NOTIFICATION_CHANNEL = "wishlist";

export async function wishlistBgTask() {
  await useWishlistStore.persist.rehydrate();
  const wishlistStore = useWishlistStore.getState();

  if (!wishlistStore.notificationEnabled) return;

  posthog.capture("wishlist_check");

  const lastWishlistCheckTs = Number.parseInt(
    (await AsyncStorage.getItem("lastWishlistCheck")) || "0"
  );
  const lastWishlistCheck = new Date(lastWishlistCheckTs);
  const now = new Date();
  console.log(
    `Last wishlist check ${lastWishlistCheck}, current date: ${now.getTime()}`
  );

  if (!isSameDayUTC(lastWishlistCheck, now) || lastWishlistCheckTs === 0) {
    await AsyncStorage.setItem("lastWishlistCheck", now.getTime().toString());

    console.log("New day, checking shop in the background");
    await checkShop(wishlistStore.skinIds);
  }

  console.log("No wishlist check needed");
}

export async function checkShop(wishlist: string[]) {
  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL, {
    name: "Wishlist",
    importance: Notifications.AndroidImportance.MAX,
  });

  try {
    await loadVersion();

    // Automatic cookies: https://github.com/facebook/react-native/issues/1274
    const res = await reAuth();
    const accessToken = getAccessTokenFromUri(res.data.response.parameters.uri);
    const userId = getUserId(accessToken);

    // Check for donator
    const isDonator = await checkDonator(userId);
    if (!isDonator) return;

    const entitlementsToken = await getEntitlementsToken(accessToken);
    const region = (await AsyncStorage.getItem("region")) || "eu";
    const shop = await getShop(accessToken, entitlementsToken, region, userId);

    var hit = false;
    for (let i = 0; i < wishlist.length; i++) {
      if (shop.SkinsPanelLayout.SingleItemOffers.includes(wishlist[i])) {
        const skinData = await axios.get<{
          status: number;
          data: ISkinLevel;
        }>(
          `https://valorant-api.com/v1/weapons/skinlevels/${
            wishlist[i]
          }?language=${getVAPILang()}`
        );
        await Notifications.scheduleNotificationAsync({
          content: {
            title: i18n.t("wishlist.name"),
            body: i18n.t("wishlist.notification.hit", {
              displayname: skinData.data.data.displayName,
            }),
          },
          trigger: {
            channelId: NOTIFICATION_CHANNEL,
            seconds: 1,
          },
        });
        hit = true;
      }
    }
    if (!hit) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t("wishlist.name"),
          body: i18n.t("wishlist.notification.no_hit"),
        },
        trigger: {
          channelId: NOTIFICATION_CHANNEL,
          seconds: 1,
        },
      });
    }
  } catch (e) {
    console.log(e);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t("wishlist.name"),
        body: i18n.t("wishlist.notification.error"),
      },
      trigger: {
        channelId: NOTIFICATION_CHANNEL,
        seconds: 1,
      },
    });
  }
}

export async function initBackgroundFetch() {
  await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15,
      stopOnTerminate: false,
      enableHeadless: true,
      startOnBoot: true,
      // Android options
      forceAlarmManager: false,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
      requiresCharging: false,
      requiresDeviceIdle: false,
      requiresBatteryNotLow: false,
      requiresStorageNotLow: false,
    },
    async (taskId: string) => {
      await wishlistBgTask();
      BackgroundFetch.finish(taskId);
    },
    (taskId: string) => {
      console.log("[Fetch] TIMEOUT taskId:", taskId);
      BackgroundFetch.finish(taskId);
    }
  );
}

export async function stopBackgroundFetch() {
  await BackgroundFetch.stop();
}
