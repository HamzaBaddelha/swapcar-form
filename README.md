# Swapcar | سواب كار - campaign financing form

Mobile-first Arabic RTL React + TypeScript + Vite form with the red/burgundy Swapcar identity (Option 1). Two validated steps cover personal and financing details, with back navigation, loading/retry states, confirmed success, and a clearly labeled development preview.

## Run

```sh
npm install
npm run dev
```

The project folder is `form-swapcar`; the npm package is `swapcar-campaign-form`. `npm run start` also starts Vite. Run `npm test` and `npm run build` to check validation/payload behavior, TypeScript, and the production build. Build output is `dist/` for static hosting.

## Branding

- Original Arabic and English outlined SVG logos, light variants, and the S symbol are in `public/brand/`.
- Colors and responsive styles are in `src/styles.css`; title, description, theme color, and favicon are in `index.html`.
- See [BRAND-GUIDELINES.md](BRAND-GUIDELINES.md) for asset provenance, palette details, usage, and the missing webfont files.
- The footer links to [Swapcar Saudi Arabia](https://swapcar.sa/ar). Contact information comes from its [English site](https://swapcar.sa/en). Previous-brand app links, service/partner lists, and payment claims were removed instead of attributing them to Swapcar.

## Configuration

- Cities: edit `src/data.ts`.
- API: copy `.env.example` to `.env`, set `VITE_FINANCING_API_URL` to a compatible endpoint and restart/rebuild. Vite environment values are public; do not add secrets. No endpoint means preview only, with no network submission and no live success message.
- UTM: captured independently in `src/service.ts`; sent only when the backend supports `campaign` and `VITE_API_SUPPORTS_UTM=true`.
- Backend contract: see `BACKEND-MAPPING.md`. The original DTO remains unchanged.

Customer data stays in React memory; there is no logging, local storage, or analytics. City is optional. Monthly salary must be at least 4,000 SAR. Both financial-obligations answers are supported, with neither preselected. Selecting "يوجد" reveals a required positive obligations amount in SAR, sent as `currentInstallments`; selecting "لا يوجد" clears and omits it. No upload fields were added. On API failure, entered values remain available for retry; requests time out after 20 seconds. Reloading clears entered values.

## Verification limits

Run `npm test` for validation and payload checks, including the 4,000 SAR salary boundary, conditional obligations amount, Arabic/Persian digits, and amount omission when there are no obligations. Run `npm run build` for TypeScript and the production build.

No compatible real API or credentials are included, so live acceptance and failure responses require verification against the configured backend. The backend must enforce the salary minimum and conditional obligations amount described in `BACKEND-MAPPING.md`.
