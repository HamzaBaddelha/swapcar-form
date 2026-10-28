import arCommon from "../../locales/ar/common.json";
import arFinancing from "../../locales/ar/financing.json";
import enCommon from "../../locales/en/common.json";
import enFinancing from "../../locales/en/financing.json";

export const resources = {
  ar: { common: arCommon, financing: arFinancing },
  en: { common: enCommon, financing: enFinancing },
};

export type TranslationNamespace = keyof typeof resources.ar;
export type TranslationKey<N extends TranslationNamespace> = keyof (typeof resources.ar)[N] & string;
