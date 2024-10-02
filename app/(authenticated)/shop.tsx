import React from "react";
import { ScrollView, View } from "react-native";
import Countdown from "~/components/Countdown";
import ShopItem from "~/components/ShopItem";
import { useUserStore } from "~/hooks/useUserStore";

function Shop() {
  const user = useUserStore((state) => state.user);
  const timestamp = new Date().getTime() + user.shops.remainingSecs.main * 1000;

  return (
    <>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignContent: "center",
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        >
          <Countdown timestamp={timestamp} />
        </View>
        {user.shops.main.map((item) => (
          <ShopItem item={item} key={item.uuid} />
        ))}
      </ScrollView>
    </>
  );
}

export default Shop;
