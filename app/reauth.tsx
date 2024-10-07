import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Paragraph, Title } from "react-native-paper";

import LoginWebView from "~/components/LoginWebView";

function ReAuth() {
  const { t } = useTranslation();

  return (
    <View style={{ padding: 20, height: "100%", width: "100%" }}>
      <Title style={{ fontSize: 25, fontWeight: "bold", color: "#fff" }}>
        {t("welcome_back")}
      </Title>
      <Paragraph style={{ marginBottom: 10 }}>
        {t("welcome_back_info")}
      </Paragraph>
      <LoginWebView />
    </View>
  );
}

export default ReAuth;
