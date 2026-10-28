"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppTranslation } from "../lib/i18n/use-app-translation";

export function BrandLink({ footer = false }: { footer?: boolean }) {
  const { t, language } = useAppTranslation("common");
  const english = language === "en";
  const src = `/brand/swapcar-logo-${english ? "en" : "ar"}${footer ? "-light" : ""}.svg`;
  return (
    <Link href="/" className={footer ? "footer-mark" : "wordmark"} aria-label={t("home")}>
      <Image className={footer ? undefined : "brand-logo"} src={src} width={footer ? 240 : 190}
        height={footer ? 53 : 42} alt={t("brand")} preload={!footer} />
    </Link>
  );
}

export default function SiteHeader() {
  const { t, i18n, language } = useAppTranslation("common");
  const nextLanguage = language === "en" ? "ar" : "en";
  const languageName = t(nextLanguage === "ar" ? "languageNameAr" : "languageNameEn");
  return (
    <header className="site-header">
      <BrandLink />
      <button className="language-switch" type="button" lang={nextLanguage}
        aria-label={t("switchLanguage", { language: languageName })}
        onClick={() => { void i18n.changeLanguage(nextLanguage); }}>
        {languageName}
      </button>
    </header>
  );
}
