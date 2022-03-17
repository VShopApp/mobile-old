import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { reset, sRegion, sUsername } from "../utils/ValorantAPI";

interface props {
  setLoggedIn: Function;
}
export default function Settings(props: PropsWithChildren<props>) {
  const handleLogout = () => {
    SecureStore.deleteItemAsync("user").then(() => {
      reset();
      props.setLoggedIn(false);
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 15 }}>
        Logged in as <Text style={{ fontWeight: "bold" }}>{sUsername}</Text>
      </Text>
      <Text style={{ fontSize: 15 }}>
        Region: <Text style={{ fontWeight: "bold" }}>{sRegion}</Text>
      </Text>
      <Button style={{ marginTop: 10 }} onPress={handleLogout} mode="contained">
        Log Out
      </Button>
    </View>
  );
}
