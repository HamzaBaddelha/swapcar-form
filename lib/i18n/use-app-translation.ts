"use client";

import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_LANGUAGE, isLanguage } from "./config";
import type { TranslationNamespace } from "./resources";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/**
 * Each streamed component must hydrate in the server language, even if another
 * island has already restored the browser's preference through the provider.
 */
export function useAppTranslation(namespace: TranslationNamespace = "common") {
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const { t, i18n } = useTranslation(namespace, { lng: hydrated ? undefined : DEFAULT_LANGUAGE });
  const language = hydrated && isLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : DEFAULT_LANGUAGE;
  return { t, i18n, language };
}
