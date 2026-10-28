import type { Metadata } from "next";
import AppProviders from "./providers";
import common from "../locales/ar/common.json";
import "./styles.css";

export const metadata: Metadata = {
  title: common.pageTitle,
  description: common.pageDescription,
  icons: { icon: "/brand/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl">
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
