# Campaign API contract

The original `create-financing.dto.ts` is preserved unchanged and is not imported by the frontend. Its endpoint is **not compatible** with this form without backend changes.

| Campaign field | Required | Backend change |
| --- | --- | --- |
| fullName | Yes | Trimmed string; existing field |
| phoneNumber | Yes | String normalized to +9665XXXXXXXX |
| city | No | Make existing city optional; omitted when empty |
| monthlySalary | Yes | Finite number of at least 4,000 SAR; enforce the same minimum on the backend |
| salaryPaymentMethod | Yes | Add enum: bank_transfer, cash, other |
| hasFinancialObligations | Yes | Add boolean; false is a valid explicit answer |
| currentInstallments | When hasFinancialObligations is true | Finite positive obligations amount in SAR; omitted when false; enforce conditional validation on the backend |

Remove campaign requirements for nationality, workplace, jobTitle, employmentStatus, and carId, or provide a separate campaign endpoint. Do not fabricate those fields. Selecting financial obligations reveals a required amount field mapped to the existing currentInstallments property. Selecting no obligations clears and omits that amount.

POST receives these fields as JSON. Any confirmed HTTP 2xx response is treated as acceptance; return 2xx only after accepting the application. Errors must return non-2xx. If your endpoint uses a different acknowledgment format, adapt `src/service.ts` before enabling it. Configure CORS for the deployed frontend origin.

Optional `campaign` object contains utm_source, utm_medium, utm_campaign, utm_term and utm_content only when `VITE_API_SUPPORTS_UTM=true`. It is captured separately and excluded by default. Define backend support before enabling.

No backend exists here. File upload types, limits, required status, storage and API contract remain undefined; no upload fields were added.
