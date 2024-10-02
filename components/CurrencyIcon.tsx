import { Image, View } from "react-native";

interface props {
  icon: "vp" | "rad";
  paper?: boolean;
}

export default function CurrencyIcon(props: props) {
  return (
    <>
      {props.paper ? (
        <View
          style={{
            margin: 8,
            height: 40,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{ width: 22, height: 22, marginRight: 15 }}
            source={
              props.icon === "vp"
                ? require("~/assets/images/vp.png")
                : require("~/assets/images/rad.png")
            }
            {...props}
          />
        </View>
      ) : (
        <Image
          style={{ width: 15, height: 15 }}
          source={
            props.icon === "vp"
              ? require("~/assets/images/vp.png")
              : require("~/assets/images/rad.png")
          }
          {...props}
        />
      )}
    </>
  );
}
