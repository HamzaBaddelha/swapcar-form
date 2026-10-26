# Swapcar identity in this project

This implementation uses **Option 1: red and burgundy with the S symbol**, selected by the user from `swapcar_new options 2026 (2).pdf` (2026 identity presentation). The supplied PDF remains unchanged in the original `brandguidelines/SWAPCAR` folder. These notes describe the website implementation; they do not replace the source identity presentation.

## Original logo artwork

All logos are extracted from the PDF's original vector paths, with proportions and colors preserved. No substitute typeface is used to recreate either wordmark.

| Asset in `public/brand/` | Source | Use |
| --- | --- | --- |
| `swapcar-logo-ar.svg` | Page 4 | Arabic header on a light background |
| `swapcar-logo-ar-light.svg` | Page 5 | Arabic footer on burgundy |
| `swapcar-logo-en.svg` | Page 3 | English wordmark on a light background |
| `swapcar-logo-en-light.svg` | Page 2 | English wordmark on burgundy |
| `swapcar-symbol.svg` | Page 3 | Original red S symbol |
| `favicon.svg` | Page 3 symbol, page 18 white tile treatment | Browser icon |

Display logos with their intrinsic aspect ratio and retain surrounding space. Do not crop, stretch, recolor, or use CSS filters on the wordmarks. Light variants already contain white lettering and the original red symbol.

## Palette

Page 9's printed RGB/HEX labels are inconsistent with its colored swatches (the red and burgundy are both labeled with gray values). This implementation uses the actual vector fill values instead, also matching the logo pages.

| Color | Web value | Role |
| --- | --- | --- |
| Swapcar red | `#C01815` | Primary buttons, emphasis, progress, selected controls, focus |
| Deep burgundy | `#25060A` | Main text, footer, icon backgrounds |
| White | `#FFFFFF` | Form surface, inverse text |
| Light gray | `#E0E0E0` | Source neutral |
| Black | `#000000` | Source neutral |

UI-only supporting shades: page `#FAF8F8`, tint `#FCF0EF`, border `#E7DFE0`, muted text `#756A6B`, and red hover `#A21412`. These are implementation shades, not additional colors specified by the PDF. White on the red primary button meets the 4.5:1 normal-text contrast threshold.

## Typography

The source specifies **Neue Montreal** for Latin text (page 7) and **Expo Arabic** for Arabic (page 8). Full webfont files were not supplied with the Swapcar assets. Embedded PDF fonts are subsets and are not shipped as production fonts.

The stylesheet names the intended families, followed by Tahoma / Segoe UI / Arial fallbacks. It does not make external font requests. The previous brand's Shubak font is no longer used. To finish exact typography, provide the full licensed WOFF2 files for the regular, medium, and bold/semibold weights and add matching `@font-face` declarations in `src/styles.css`.

## Content and destinations

Use `سواب كار` in Arabic and `Swapcar` in English. Page metadata, accessible labels, form heading, success message, and copyright use the new name. The two-step form, field requirements, and API payload are unchanged.

Website: https://swapcar.sa/ar. Public contact details checked at https://swapcar.sa/en on 2026-10-26: `920032590`, `sales@swapcar.sa`. The `.com` address shown in the concept PDF was not used as the live destination. Previous-brand app/store links and unsupported footer claims are not carried over.
