import { View } from "react-native";
import Loading from "~/components/Loading";

function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loading />
    </View>
  );
}

export default Index;
