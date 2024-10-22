import { useNavigation } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { RadioButton } from "react-native-paper";
import { resources } from "~/utils/localization";

function Language() {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();

  return (
    <ScrollView>
      <RadioButton.Group
        onValueChange={(value) => {
          i18n.changeLanguage(value);
          navigation.goBack();
        }}
        value={i18n.language}
      >
        {Object.keys(resources).map((lang) => (
          <RadioButton.Item
            key={lang}
            label={`${t(`languages.${lang}`)} (${lang})`}
            value={lang}
          />
        ))}
      </RadioButton.Group>
    </ScrollView>
  );
}

export default Language;
