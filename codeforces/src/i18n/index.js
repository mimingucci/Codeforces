import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enTranslation from "./locales/en.json";
import viTranslation from "./locales/vi.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  vi: {
    translation: viTranslation,
  },
};

// Safe localStorage access
const getStoredLanguage = () => {
  try {
    return localStorage.getItem("language") || "en";
  } catch {
    return "en";
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "language",
      checkWhitelist: true,
    },

    react: {
      useSuspense: false,
    },
  });

// Listen for language changes and save to localStorage
i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem("language", lng);
  } catch (error) {
    console.warn("Cannot save language to localStorage:", error);
  }
});

export default i18n;
