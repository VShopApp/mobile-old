import React from "react";
import { ScrollView, View } from "react-native";
import BundleImage from "~/components/BundleImage";
import BundleItem from "~/components/BundleItem";
import { useUserStore } from "~/hooks/useUserStore";

function Bundles() {
  const user = useUserStore(({ user }) => user);

  return (
    <>
      <ScrollView>
        {user.shops.bundles.map((bundle, i) => (
          <View key={bundle.uuid}>
            <BundleImage
              bundle={bundle}
              remainingSecs={user.shops.remainingSecs.bundles[i]}
            />
            {bundle.items.map((item, i) => (
              <BundleItem item={item} key={item.uuid} />
            ))}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

export default Bundles;
