import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createAppI18n, isLanguage, languageDirection } from "../lib/i18n/config.ts";

const namespaces = ["common", "financing"];
const resources = Object.fromEntries(["ar", "en"].map(language => [language,
  Object.fromEntries(namespaces.map(namespace => [namespace,
    JSON.parse(readFileSync(new URL(`../locales/${language}/${namespace}.json`, import.meta.url), "utf8")),
  ])),
]));

test("Arabic and English have matching, nonempty translation keys", () => {
  for (const namespace of namespaces) {
    assert.deepEqual(Object.keys(resources.ar[namespace]).sort(), Object.keys(resources.en[namespace]).sort());
    for (const language of ["ar", "en"]) {
      for (const value of Object.values(resources[language][namespace])) {
        assert.equal(typeof value, "string");
        assert.ok(value.trim());
      }
    }
  }
});

test("bundled i18next resources initialize synchronously in Arabic and switch without loading a backend", async () => {
  const instance = createAppI18n(resources);
  assert.equal(instance.isInitialized, true);
  assert.equal(instance.t("pageTitle"), resources.ar.common.pageTitle);
  assert.equal(instance.t("loading", { ns: "financing" }), resources.ar.financing.loading);
  await instance.changeLanguage("en");
  assert.equal(instance.t("pageTitle"), resources.en.common.pageTitle);
  assert.equal(instance.t("switchLanguage", { language: "العربية" }), "Switch language to العربية");
  assert.equal(instance.t("iframeTitle", { ns: "financing" }), resources.en.financing.iframeTitle);
});

test("locale instances do not leak language changes between SSR renders", async () => {
  const first = createAppI18n(resources);
  const second = createAppI18n(resources);
  await first.changeLanguage("en");
  assert.equal(first.language, "en");
  assert.equal(second.language, "ar");
  assert.equal(second.t("pageTitle"), resources.ar.common.pageTitle);
});

test("only supported preferences are accepted and direction matches the language", () => {
  assert.equal(isLanguage("ar"), true);
  assert.equal(isLanguage("en"), true);
  for (const value of [null, undefined, "fr", "", "en<script>"]) assert.equal(isLanguage(value), false);
  assert.equal(languageDirection("ar"), "rtl");
  assert.equal(languageDirection("en"), "ltr");
});
