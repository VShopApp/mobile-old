import i18n, { ModuleType } from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import languages from "~/assets/langs.json";

import en from "~/assets/i18n/en.json";

const resources = {
  en: {
    translation: en,
  },
};

export const langCodes = [
  "en",
  ...languages.map((language) => language.langCode),
];

const langDetector = {
  type: "languageDetector" as ModuleType,
  async: true,
  detect: (callback: any) => {
    AsyncStorage.getItem("language", (error, result) => {
      if (error || !result) {
        const lang = getLocales()[0].languageCode || "en";
        callback(lang);
      } else {
        callback(result);
      }
    });
  },
  init: () => {},
  cacheUserLanguage: (language: string) => {
    AsyncStorage.setItem("language", language);
  },
};

i18n
  .use(langDetector)
  .use(initReactI18next)
  .init({
    resources,
    compatibilityJSON: "v3",
    supportedLngs: langCodes,
    fallbackLng: "en",
    debug: __DEV__,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
