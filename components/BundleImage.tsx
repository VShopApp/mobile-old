import { ImageBackground, View } from "react-native";
import { Text } from "react-native-paper";
import CurrencyIcon from "./CurrencyIcon";
import Countdown from "./Countdown";
import { useFeatureStore } from "~/hooks/useFeatureStore";

interface props {
  bundle: IBundle;
  remainingSecs: number;
}
export default function Bundle({ bundle, remainingSecs }: props) {
  const timestamp = new Date().getTime() + remainingSecs * 1000;
  const { screenshotModeEnabled } = useFeatureStore();

  return (
    <ImageBackground
      style={{
        marginBottom: 5,
        flex: 1,
        justifyContent: "center",
      }}
      source={{ uri: bundle.displayIcon }}
      resizeMode="cover"
    >
      <View
        style={{
          backgroundColor: !screenshotModeEnabled ? "#000000a0" : "#000000",
          padding: 50,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 30,
          }}
        >
          {bundle.displayName}
        </Text>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 15,
          }}
        >
          {bundle.price} <CurrencyIcon icon="vp" />
        </Text>
        <View
          style={{ position: "absolute", bottom: 5, right: 5, padding: 10 }}
        >
          <Countdown timestamp={timestamp} />
        </View>
      </View>
    </ImageBackground>
  );
}
