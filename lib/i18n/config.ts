import { createInstance, type Resource } from "i18next";

export const LANGUAGES = ["ar", "en"] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "ar";
export const LANGUAGE_STORAGE_KEY = "swapcar.language";

export function isLanguage(value: unknown): value is Language {
  return value === "ar" || value === "en";
}

export function languageDirection(language: Language): "rtl" | "ltr" {
  return language === "ar" ? "rtl" : "ltr";
}

/** A new instance per provider avoids sharing mutable locale state across SSR requests. */
export function createAppI18n(resources: Resource) {
  const instance = createInstance();
  // Resources are bundled: initialization needs no HTTP request or async backend.
  void instance.init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...LANGUAGES],
    ns: ["common", "financing"],
    defaultNS: "common",
    initAsync: false,
    interpolation: { escapeValue: false },
    returnNull: false,
    react: { useSuspense: false },
  });
  return instance;
}
