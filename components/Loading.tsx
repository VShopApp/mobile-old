import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

interface props {
  msg?: string;
}
export default function Loading({ msg }: props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator animating={true} color={"#fa4454"} size="large" />
      {msg && <Text style={{ marginTop: 10, color: "#fff" }}>{msg}</Text>}
    </View>
  );
}
