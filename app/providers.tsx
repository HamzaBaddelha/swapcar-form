"use client";

import { useEffect, useState, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { createAppI18n, isLanguage, languageDirection, LANGUAGE_STORAGE_KEY } from "../lib/i18n/config";
import { resources } from "../lib/i18n/resources";

export default function AppProviders({ children }: { children: ReactNode }) {
  const [i18n] = useState(() => createAppI18n(resources));

  useEffect(() => {
    const syncLanguage = () => {
      const language = isLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : "ar";
      document.documentElement.lang = language;
      document.documentElement.dir = languageDirection(language);
      document.title = i18n.t("pageTitle");
      document.querySelector('meta[name="description"]')?.setAttribute("content", i18n.t("pageDescription"));
      try { window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language); } catch { /* Preference storage is optional. */ }
    };
    // SSR and the first client render are both Arabic. Restore preference only
    // after hydration, without remounting or navigating the customer's iframe.
    let savedLanguage: string | null = null;
    try { savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY); } catch { /* Storage may be unavailable. */ }
    i18n.on("languageChanged", syncLanguage);
    if (isLanguage(savedLanguage)) void i18n.changeLanguage(savedLanguage);
    syncLanguage();
    return () => { i18n.off("languageChanged", syncLanguage); };
  }, [i18n]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
