import { getAccessTokenFromUri, getVAPILang } from "./misc";
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
import { Platform } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_FETCH_TASK = "wishlist_check";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  if (Platform.OS !== "android") return;

  const now = Date.now();

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`
  );

  const lastWishlistCheck = Number.parseInt(
    (await AsyncStorage.getItem("lastWishlistCheck")) || "0"
  );
  const lastCheckedMs = new Date().getTime() - lastWishlistCheck;

  if (60 * 1000 < lastCheckedMs || lastWishlistCheck === 0) {
    await AsyncStorage.setItem(
      "lastWishlistCheck",
      new Date().getTime().toString()
    );

    await checkShop();
  }

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export async function registerWishlistCheck() {
  if (Platform.OS !== "android") return;

  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 15,
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

export async function unregisterWishlistCheck() {
  if (Platform.OS !== "android") return;

  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export async function isWishlistCheckRegistered() {
  return TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
}

async function checkShop() {
  await Notifications.setNotificationChannelAsync("wishlist", {
    name: "Wishlist",
    importance: Notifications.AndroidImportance.DEFAULT,
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

    await useWishlistStore.persist.rehydrate();
    const wishlist = useWishlistStore.getState().skinIds;

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
          trigger: null,
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
        trigger: null,
      });
    }
  } catch (e) {
    console.log(e);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t("wishlist.name"),
        body: i18n.t("wishlist.notification.error"),
      },
      trigger: null,
    });
  }
}
