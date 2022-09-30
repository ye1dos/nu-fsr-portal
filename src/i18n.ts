import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourses from "./translations";

i18n.use(initReactI18next).init({
  resources: resourses,
  fallbackLng: "ru",
  debug: true,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: '.',
  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ",",
  },

  react: {
    wait: true,
  },
});

export interface I18nObserver {
  i18n?;
}

export default i18n;
