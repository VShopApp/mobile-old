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
import { Image } from "expo-image";
import { regions } from "~/utils/misc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "~/hooks/useUserStore";
import LoginWebView from "~/components/LoginWebView";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

function Setup() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [offsetX, setOffsetX] = useState(0);
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();
  const { colors } = useTheme();

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
            <LoginWebView />
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
            disabled={Math.round(offsetX) === 0}
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
