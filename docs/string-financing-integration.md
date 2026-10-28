# String iframe integration and cleanup report

29 October 2026. String is the only financing form and lead-submission path. The website contains one application page, its brand shell, the official iframe, and Arabic/English localization.

## Audit and decisions

Before deletion, imports, routes, dynamic logo paths, CSS selectors, translations, tests and dependency configuration were checked. The only application route is `/`; Next also supplies its normal not-found page.

The former native form model/city list/Vite submission service were unused. Vehicle mapping/context existed only as an unused optional page prop and mapping helper. Query had a provider but no actual queries. All live UI classes had custom CSS definitions; Tailwind supplied only incidental resets. No React Hook Form, direct Zod, Axios, inventory hooks, vehicle components, authentication client or additional working application pages existed.

The remaining page has no native customer fields, selected vehicle, financing record, custom validation, submission request or API configuration. It never tries to submit the iframe programmatically.

## Files deleted

| Files | Reason |
| --- | --- |
| `app/main.tsx` | Merged its retained brand shell directly into `app/page.tsx`; removed the redundant route wrapper. |
| `app/data.ts`, `app/model.ts`, `app/service.ts` | Removed legacy city data, native form/validation/payload types and the unused Vite campaign API submission. |
| `app/globals.css` | Removed the Tailwind import; the remaining website uses its own stylesheet. |
| `app/favicon.ico` | Removed the duplicate starter favicon route; the used brand SVG favicon remains. |
| `lib/query-client.ts` | Removed idle Query configuration and cache infrastructure. |
| `lib/i18n/format.ts` | Removed unused vehicle currency formatting. |
| `locales/ar/cars.json`, `locales/en/cars.json` | Removed unused vehicle translations. |
| `docs/frontend-upgrade-audit.md` | Removed the obsolete vehicle integration plan. |
| `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` | Removed unreferenced starter assets. |
| `public/Google_Play-Logo.wine.png`, `public/ios-store.jpg` | Removed unreferenced store badges. |
| `public/mada.png`, `public/tamara.jpg`, `public/visa.png` | Removed unreferenced payment images. |
| `public/brand/swapcar-symbol.svg` | Removed an unused standalone symbol; the favicon and four used logo variants remain. |

This is 22 deleted files. No unrelated working route or shared consumer was removed.

## Files modified

- `app/page.tsx`: contains the brand shell directly, without the optional vehicle prop/context.
- `app/layout.tsx`: retains the website stylesheet and brand favicon; drops the deleted stylesheet.
- `app/providers.tsx`: retains only the scoped i18next provider; synchronizes translated browser title/description and direction.
- `app/string-finance-form.tsx`: retains the iframe lifecycle/loading/retry; uses the supplied no-scroll/auto-height initial configuration and a dedicated retry class.
- `app/string-form.ts`: retains only URL, safe UTM parameters, message validation and listener cleanup; removes obsolete customer/vehicle interfaces and mapping helper.
- `app/styles.css`: removes all native-step/input/radio/validation/result/vehicle styles, unused token and stale brand-guide comment. Adds the small explicit resets needed after removing Tailwind.
- `components/localized-text.tsx`: removes the unused currency component.
- `lib/i18n/config.ts`, `lib/i18n/resources.ts`: retain only the two used namespaces.
- `locales/ar/common.json`, `locales/en/common.json`: remove the unused navigation label.
- `next.config.ts`: removes the obsolete Tailwind CSS loader; retains the existing Next rendering/agent configuration.
- `package.json`, `package-lock.json`: remove unused dependencies. The package now explicitly declares ESM, matching its source and removing the Node test-loader warnings.
- `tests/string-form.test.mjs`, `tests/frontend-infrastructure.test.mjs`: retain relevant protocol/privacy/security and localization checks; remove tests for deleted functionality.
- `README.md`, this report: replace the former architecture/planning material with current run instructions, cleanup inventory and limitations.

## Dependencies

Removed direct dependencies: `@tanstack/react-query`, `@tailwindcss/turbopack`, `tailwindcss`. Their unused transitive dependencies were pruned from the lockfile. No Query/Tailwind packages remain in the dependency graph.

Runtime dependencies now comprise Next, React, React DOM, i18next and react-i18next. TypeScript, React/Node types, ESLint and eslint-config-next remain necessary development tools. Zod is still an ESLint transitive dependency; it was never used for the application and must not be manually removed from ESLint's dependency tree. React Hook Form and Axios were not installed.

## Remaining structure

```text
app/
  layout.tsx
  page.tsx
  providers.tsx
  string-finance-form.tsx
  string-form.ts
  styles.css
components/
  site-header.tsx
  localized-text.tsx
lib/i18n/
  config.ts
  resources.ts
  use-app-translation.ts
locales/
  ar/{common,financing}.json
  en/{common,financing}.json
public/brand/
  favicon.svg
  swapcar-logo-{ar,en}.svg
  swapcar-logo-{ar,en}-light.svg
tests/
  string-form.test.mjs
  frontend-infrastructure.test.mjs
docs/
  string-financing-integration.md
```

Root configuration, lockfile, README and the repository's required AGENTS instructions remain. Temporary browser inspection artifacts live in ignored `.tmp/`; they are not production code.

## Official iframe behavior

The URL is preserved exactly:

```text
https://dashboard.thestring.net/forms/0aa8b3fe-d730-4e92-9015-e5af34ab01a6/show?domain=https://swipecar.production.thestring.net/api/v1&v=way9w9lfyaj&utm_source=website
```

- `formIframe` uses full width, border zero, a 400px minimum, `height:auto` initially and `scrolling=no`. Valid height messages then set its pixel height.
- React installs the bridge before setting the source, including cached loads. It cleans up message/load/error/popstate listeners and timers on unmount.
- On load or `REQUEST_FORM_PARAMS`, it posts only `FORM_PARAMS` to `https://dashboard.thestring.net`.
- Both origin and `event.source === iframe.contentWindow` are required for incoming messages. Height must be a finite numeric value in the supplied 300–5000 bounds; CSS still enforces the 400px minimum.
- Both the URL and every message fix `utm_source=website`. The parent source cannot overwrite it.
- Only verified marketing keys `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` may accompany the fixed source, bounded to String's 255-character limit. Arbitrary query data, customer details, vehicle IDs, routing overrides and locale guesses are excluded.
- No direct CRM request, custom lead submission, iframe DOM access, style injection or undocumented message is introduced. String owns all submission/confirmation.
- The no-referrer policy and independent link prevent leaking a private parent query through referrers. The parent does not store customer form data.
- Loading, a 20-second timeout, retry with a fresh iframe, and an always-available open-form link remain. Retry warns that entered data may need to be entered again; the page never intentionally duplicates the form or asks for a second copy of customer details.

## UI and localization

The existing Swapcar colors, hero, logos, application card, footer, contact links and mobile layouts are preserved. The removed CSS belonged to inactive native forms; the remaining design uses explicit CSS without a framework dependency. The original starter favicon can no longer compete with the brand favicon.

Arabic and English website text, logo variants, RTL/LTR direction, document title/description, loading/fallback copy and accessibility labels remain supported. The stored preference survives reload and storage denial is handled. Each streamed client component hydrates in Arabic before applying the preference, avoiding the previously reproduced hydration mismatch.

Changing website language retains the same iframe node and does not navigate or reset the customer's application. String's currently Arabic form remains under its own configuration; English users see a clear notice. No unsupported internal language parameter or DOM translation is attempted. The retained default server document/metadata are Arabic; no new locale routes or multilingual SEO system were added.

## Verification and vendor boundary

Final checks and observed live behavior are recorded below. No authorized test submission was made; saved CRM records/source and any custom attributes are unverified.

| Check | Result |
| --- | --- |
| TypeScript (`npx tsc --noEmit`) | Passed. |
| ESLint (`npm run lint`) | Passed. |
| Production build (`npm run build`) | Passed; `/` statically generates and the framework not-found page remains. |
| Node tests (`npm test`) | 10 passed: 6 protocol/privacy/security tests and 4 localization tests, with no module-loader warnings. |
| Dependency/source audit | No Query/Tailwind entries in the manifest/lockfile, no imports of deleted files, no application API/submission client or unused vehicle namespace. |
| Browser at 1440px, 390px and 320px | Passed RTL/LTR, language switch, preference reload, denied-storage handling and no horizontal overflow; screenshots reviewed. |
| Navigation and branding | Financing anchor works; missing routes return 404; title/description translate; the used brand favicon is served. |
| Single form and network behavior | One iframe, zero parent forms/customer inputs, zero parent API requests; no new iframe navigation during language switching. |
| Loading/recovery/message checks | Loading, 20-second timeout, retry remount, wrong-origin/source rejection, height bounds, valid resize and later recovery passed in controlled browser checks with no page errors. |
| Live String embed | Public form definition HTTP 200, rendered form, `REQUEST_FORM_PARAMS`, actual receipt of fixed-source UTM parameters and 528px height updates observed on desktop/mobile. |

The live embed still makes its own `https://swipecar.production.thestring.net/api/v1/auth/context` request, which returned HTTP 401 and produced a resource console error. This vendor-owned request is not a website API integration. No customer form was submitted to test CRM persistence.

Npm's uninstall removed 15 packages but Windows kept two now-unused native binaries open in ignored uninstall-cache folders under `node_modules` (`@tailwindcss/.oxide-win32-x64-msvc-fMaw7YJB` and `.lightningcss-win32-x64-msvc-YQTbP4Ng`). A targeted cleanup attempt confirmed they remain locked by a running process. They are absent from the dependency graph and production build inputs; physical cache cleanup must wait until the process releases them. No unrelated running development process was stopped to force their removal.

String controls its internal fields, styling, validation, language, vehicle functionality and stored attributes. Its previously inspected `FORM_PARAMS` client does not establish arbitrary scalar attribute prefill. All obsolete website-side mapping has been removed rather than being presented as working CRM persistence.

A cross-origin iframe load or height signal cannot prove successful lead creation or expose every internal load/submission error. The parent keeps recovery controls instead of displaying a fabricated success state.
