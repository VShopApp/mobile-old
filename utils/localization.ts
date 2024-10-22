import i18n, { ModuleType } from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";

import en from "~/assets/i18n/en.json";
import ar from "~/assets/i18n/ar.json";
import de from "~/assets/i18n/de.json";
import es from "~/assets/i18n/es.json";
import fr from "~/assets/i18n/fr.json";
import it from "~/assets/i18n/it.json";
import jp from "~/assets/i18n/jp.json";
import ko from "~/assets/i18n/ko.json";
import no from "~/assets/i18n/no.json";
import pl from "~/assets/i18n/pl.json";
import pt from "~/assets/i18n/pt.json";
import ru from "~/assets/i18n/ru.json";
import th from "~/assets/i18n/th.json";
import tr from "~/assets/i18n/tr.json";
import uk from "~/assets/i18n/uk.json";
import vi from "~/assets/i18n/vi.json";
import zhHans from "~/assets/i18n/zh-Hans.json";
import zhHant from "~/assets/i18n/zh-Hant.json";

// https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
export const resources = {
  ar: { translation: ar, VAPILangCode: "ar-AE" },
  de: { translation: de, VAPILangCode: "de-DE" },
  en: { translation: en, VAPILangCode: "en-US" },
  es: { translation: es, VAPILangCode: "es-ES" },
  fr: { translation: fr, VAPILangCode: "fr-FR" },
  it: { translation: it, VAPILangCode: "it-IT" },
  jp: { translation: jp, VAPILangCode: "ja-JP" },
  ko: { translation: ko, VAPILangCode: "ko-KR" },
  no: { translation: no, VAPILangCode: "en-US" },
  pl: { translation: pl, VAPILangCode: "pl-PL" },
  pt: { translation: pt, VAPILangCode: "pt-BR" },
  ru: { translation: ru, VAPILangCode: "ru-RU" },
  th: { translation: th, VAPILangCode: "th-TH" },
  tr: { translation: tr, VAPILangCode: "tr-TR" },
  uk: { translation: uk, VAPILangCode: "vi-VN" },
  vi: { translation: vi, VAPILangCode: "vi-VN" },
  "zh-Hans": { translation: zhHans, VAPILangCode: "zh-CN" },
  "zh-Hant": { translation: zhHant, VAPILangCode: "zh-TW" },
};

export const getVAPILang = () => {
  const translation = resources[i18n.language as keyof typeof resources];

  return translation ? translation.VAPILangCode : "en-US";
};

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
