import React from "react";
import { ScrollView, View } from "react-native";
import { Avatar, List, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useUserStore } from "~/hooks/useUserStore";
import CurrencyIcon from "~/components/CurrencyIcon";

function Profile() {
  const user = useUserStore(({ user }) => user);
  const { t } = useTranslation();

  return (
    <ScrollView style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 15,
        }}
      >
        <Avatar.Text size={48} label={user.name.slice(0, 2).toUpperCase()} />
        <Text style={{ marginLeft: 10, fontSize: 30, fontWeight: "bold" }}>
          {user.name}
        </Text>
      </View>
      <List.Section title={t("info")}>
        <List.Item
          title={t("region")}
          description={t(`regions.${user.region}`)}
          left={(props) => <List.Icon {...props} icon="earth" />}
        />
      </List.Section>
      <List.Section title={t("progress")}>
        <List.Item
          title={t("level")}
          description={user.progress.level}
          left={(props) => <List.Icon {...props} icon="chevron-triple-up" />}
        />
        <List.Item
          title={t("xp")}
          description={user.progress.xp}
          left={(props) => <List.Icon {...props} icon="chevron-triple-up" />}
        />
      </List.Section>
      <List.Section title={t("balances")}>
        <List.Item
          title={t("vp")}
          description={user.balances.vp.toString()}
          descriptionNumberOfLines={1}
          left={(props) => <CurrencyIcon {...props} icon="vp" paper />}
        />
        <List.Item
          title={t("rad")}
          description={user.balances.rad.toString()}
          descriptionNumberOfLines={1}
          left={(props) => <CurrencyIcon {...props} icon="rad" paper />}
        />
        <List.Item
          title={t("fag")}
          description={user.balances.fag.toString()}
          descriptionNumberOfLines={1}
          left={(props) => <List.Icon {...props} icon="account-supervisor" />}
        />
      </List.Section>
    </ScrollView>
  );
}

export default Profile;
