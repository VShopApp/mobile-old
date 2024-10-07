import AsyncStorage from "@react-native-async-storage/async-storage";
import CookieManager from "@react-native-cookies/cookies";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFeatureStore } from "~/hooks/useFeatureStore";
import { useUserStore } from "~/hooks/useUserStore";
import { getAccessTokenFromUri } from "~/utils/misc";
import {
  defaultUser,
  getBalances,
  getEntitlementsToken,
  getProgress,
  getShop,
  getUserId,
  getUsername,
  loadOffers,
  loadSkins,
  loadVersion,
  parseShop,
} from "~/utils/valorant-api";
import { checkDonator } from "~/utils/vshop-api";
import Loading from "./Loading";
import { View } from "react-native";
import WebView from "react-native-webview";
import { usePostHog } from "posthog-react-native";

const LOGIN_URL =
  "https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1&scope=account%20openid";

export default function LoginWebView() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const { enableDonator, disableDonator } = useFeatureStore();
  const [loading, setLoading] = useState<string | null>(null);
  const { t } = useTranslation();
  const posthog = usePostHog();

  const handleWebViewChange = async (newNavState: {
    url?: string;
    title?: string;
    loading?: boolean;
    canGoBack?: boolean;
    canGoForward?: boolean;
  }) => {
    if (!newNavState.url) return;

    if (newNavState.url.includes("access_token=")) {
      const accessToken = getAccessTokenFromUri(newNavState.url);
      try {
        const region =
          (await AsyncStorage.getItem("region")) || defaultUser.region;

        setLoading(t("fetching.version"));
        await loadVersion();

        setLoading(t("fetching.skins"));
        await loadSkins();

        setLoading(t("fetching.entitlements_token"));
        const entitlementsToken = await getEntitlementsToken(accessToken);

        setLoading(t("fetching.user_id"));
        const userId = getUserId(accessToken);

        setLoading(t("fetching.username"));
        const username = await getUsername(
          accessToken,
          entitlementsToken,
          userId,
          region
        );

        setLoading(t("fetching.offers"));
        await loadOffers(accessToken, entitlementsToken, region);

        setLoading(t("fetching.storefront"));
        const shop = await getShop(
          accessToken,
          entitlementsToken,
          region,
          userId
        );
        const shops = await parseShop(shop);

        setLoading(t("fetching.progress"));
        const progress = await getProgress(
          accessToken,
          entitlementsToken,
          region,
          userId
        );

        setLoading(t("fetching.balances"));
        const balances = await getBalances(
          accessToken,
          entitlementsToken,
          region,
          userId
        );

        setLoading(t("fetching.donator"));
        const isDonator = await checkDonator(userId);
        if (isDonator) enableDonator();
        else disableDonator();

        posthog.identify(userId);
        setUser({
          id: userId,
          name: username,
          region,
          shops,
          progress,
          balances,
        });
        router.replace("/shop");
      } catch (e) {
        console.log(e);
        await CookieManager.clearAll(true);
        router.replace("/setup"); // Fallback to setup, so user doesn't get stuck
      }
    }
  };

  if (loading) {
    return <Loading msg={loading} />;
  }

  return (
    <View
      style={{
        height: "80%",
      }}
      renderToHardwareTextureAndroid
    >
      <WebView
        userAgent="Mozilla/5.0 (Linux; Android) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36"
        source={{
          uri: LOGIN_URL,
        }}
        onNavigationStateChange={handleWebViewChange}
        injectedJavaScriptBeforeContentLoaded={`(function() {
              const deleteCookieBanner = () => {
                if (document.getElementsByClassName('osano-cm-window').length > 0) document.getElementsByClassName('osano-cm-window')[0].style = "display:none;";
                else setTimeout(deleteCookieBanner, 10)
              }
              deleteCookieBanner();
            })();`}
      />
    </View>
  );
}
