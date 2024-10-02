import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, SafeAreaView, ScrollView, View } from "react-native";
import {
  Button,
  Paragraph,
  RadioButton,
  Title,
  useTheme,
} from "react-native-paper";
import WebView from "react-native-webview";
import { Image } from "expo-image";
import { getAccessTokenFromUri, regions } from "~/utils/misc";
import {
  loadSkins,
  loadVersion,
  getProgress,
  getBalances,
  getEntitlementsToken,
  getShop,
  parseShop,
  getUserId,
  getUsername,
  loadOffers,
} from "~/utils/valorant-api";
import Loading from "~/components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "~/hooks/useUserStore";
import { useFeatureStore } from "~/hooks/useFeatureStore";
import { checkDonator } from "~/utils/vshop-api";
import { useRouter } from "expo-router";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const LOGIN_URL =
  "https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1&scope=account%20openid";

function Setup() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [offsetX, setOffsetX] = useState(0);
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();
  const { enableDonator, disableDonator } = useFeatureStore();
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const { colors } = useTheme();

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
          user.region
        );

        setLoading(t("fetching.offers"));
        await loadOffers(accessToken, entitlementsToken, user.region);

        setLoading(t("fetching.storefront"));
        const shop = await getShop(
          accessToken,
          entitlementsToken,
          user.region,
          userId
        );
        const shops = await parseShop(shop);

        setLoading(t("fetching.progress"));
        const progress = await getProgress(
          accessToken,
          entitlementsToken,
          user.region,
          userId
        );

        setLoading(t("fetching.balances"));
        const balances = await getBalances(
          accessToken,
          entitlementsToken,
          user.region,
          userId
        );

        setLoading(t("fetching.donator"));
        const isDonator = await checkDonator(userId);
        if (isDonator) enableDonator();
        else disableDonator();

        setUser({
          id: userId,
          name: username,
          region: user.region,
          shops,
          progress,
          balances,
        });

        router.replace("/shop");
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        onMomentumScrollEnd={(event) =>
          setOffsetX(event.nativeEvent.contentOffset.x)
        }
      >
        <View
          style={{
            justifyContent: "space-evenly",
            width: windowWidth,
          }}
        >
          <Image
            style={{
              height: "70%",
              width: windowWidth,
            }}
            contentFit="contain"
            source={require("~/assets/images/mockup.png")}
          />
          <View
            style={{
              flexDirection: "column",
              width: windowWidth,
              marginHorizontal: 20,
            }}
          >
            <Title style={{ fontSize: 25, fontWeight: "bold", color: "#fff" }}>
              {t("welcome")}
            </Title>
            <Paragraph>{t("promotional")}</Paragraph>
          </View>
        </View>
        <View
          style={{
            width: windowWidth,
            height: windowHeight,
            padding: 20,
          }}
        >
          <Title style={{ fontSize: 25, fontWeight: "bold", color: "#fff" }}>
            {t("region")}
          </Title>
          <Paragraph style={{ color: "orange", marginBottom: 10 }}>
            {t("region_info")}
          </Paragraph>
          <RadioButton.Group
            onValueChange={(value) => {
              setUser({ ...user, region: value });
              AsyncStorage.setItem("region", value);
            }}
            value={user.region}
          >
            {regions.map((region) => (
              <RadioButton.Item
                key={region}
                label={`${t(`regions.${region}`)} (${region.toUpperCase()})`}
                value={region}
              />
            ))}
          </RadioButton.Group>
        </View>
        {user.region.length > 0 && (
          <View
            style={{
              width: windowWidth,
              height: windowHeight,
            }}
          >
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 20,
                maxHeight: "15%",
              }}
            >
              <Title
                style={{ fontSize: 25, fontWeight: "bold", color: "#fff" }}
              >
                {t("signin")}
              </Title>
              <Paragraph style={{ marginBottom: 10 }}>
                {t("signin_info")}
              </Paragraph>
            </View>
            {!loading ? (
              <View
                style={{
                  height: "75%",
                  width: windowWidth,
                  paddingHorizontal: 15,
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
                    const deleteSignUp = () => {
                      if (document.getElementsByClassName('signup-link').length > 0) document.getElementsByClassName('signup-link')[0].remove();
                      else setTimeout(deleteSignUp, 10)
                    }
                    const deleteCookieBanner = () => {
                      if (document.getElementsByClassName('osano-cm-window').length > 0) document.getElementsByClassName('osano-cm-window')[0].style = "display:none;";
                      else setTimeout(deleteCookieBanner, 10)
                    }
                    deleteCookieBanner();
                    deleteSignUp();
                  })();`}
                />
              </View>
            ) : (
              <Loading msg={loading} />
            )}
          </View>
        )}
      </ScrollView>
      <View>
        <View style={{ flexDirection: "row" }}>
          <Button
            onPress={() => {
              const x = offsetX - windowWidth;
              scrollViewRef.current?.scrollTo({
                x,
                animated: true,
              });
              setOffsetX(x);
            }}
            style={{ width: "50%" }}
            disabled={Math.round(offsetX) === 0 || loading != null}
          >
            {t("back")}
          </Button>
          <Button
            onPress={() => {
              const x = offsetX + windowWidth;
              scrollViewRef.current?.scrollTo({
                x,
                animated: true,
              });
              setOffsetX(x);
            }}
            style={{ width: "50%" }}
            disabled={
              Math.round(offsetX / windowWidth) === 2 ||
              (Math.round(offsetX / windowWidth) === 1 &&
                user.region.length <= 0)
            }
          >
            {t("next")}
          </Button>
        </View>
      </View>
      <SafeAreaView style={{ backgroundColor: colors.background }} />
    </>
  );
}

export default Setup;
