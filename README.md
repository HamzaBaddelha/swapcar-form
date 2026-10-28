# Swapcar financing website

A lightweight Next.js App Router website around the official String CRM iframe. String owns all customer fields, validation, submission and lead creation. The website supplies branding, responsive layout, Arabic/English presentation, loading and recovery controls.

## Run

Use Node 22.18+ (verified on Node 24).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` followed by `npm start`.

## Checks

```sh
npm test
npm run lint
npx tsc --noEmit
npm run build
```

## Architecture

- `app/page.tsx`: the single website page and branded shell.
- `app/string-finance-form.tsx`, `app/string-form.ts`: official embed, guarded messaging, resizing and recovery.
- `app/providers.tsx`, `lib/i18n/`, `locales/{ar,en}/`: website localization only.
- `components/`: header, language switch and localized text.
- `app/styles.css`, `public/brand/`: the used brand styles and assets.
- `tests/`: message security, source and localization regression checks.

The source stays `website` in both the iframe URL and every `FORM_PARAMS` message. Arbitrary customer query parameters are never forwarded. Switching the website language retains the same iframe; the embedded form's language remains controlled by String.

There is no native financing form, vehicle workflow, custom submission service, React Query or Tailwind dependency. No application API configuration is required.

See [the integration and cleanup report](docs/string-financing-integration.md) for the exact deletion inventory, protocol behavior, verification results and limitations controlled by String.
