import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ns1EN from "./locales/en/ns1.json";
import ns2EN from "./locales/en/ns2.json";
import ns1VI from "./locales/vi/ns1.json";
import ns2VI from "./locales/vi/ns2.json";

// import this file to src/main or src/index

i18n.use(initReactI18next).init({
  resources: {
    en: {
      ns1: ns1EN,
      ns2: ns2EN,
    },
    vi: {
      ns1: ns1VI,
      ns2: ns2VI,
    },
  },
  defaultNS: "ns1",
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});
