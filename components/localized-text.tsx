"use client";

import { useAppTranslation } from "../lib/i18n/use-app-translation";
import type { TranslationKey, TranslationNamespace } from "../lib/i18n/resources";

export function Text<N extends TranslationNamespace>({ ns, id }: { ns: N; id: TranslationKey<N> }) {
  const { t } = useAppTranslation(ns);
  return <>{t(id)}</>;
}

