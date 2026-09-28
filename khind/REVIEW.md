# KHIND customer page

Prepared 27 September 2026 for Akizen's `/khind/` route. Updated 28 September 2026 after two UI/UX audit passes. Static HTML/CSS/JavaScript; no build step.

## Current state

- Published at `https://akizen.my/khind/`.
- Search indexing is enabled intentionally.
- Single-page funnel remains: discovery → products → details → WhatsApp → KHIND process.
- Bahasa Melayu catalogue: 13 individual models and 10 bundle choices.
- Product-specific WhatsApp enquiries use **0174201247 / 60174201247**, supplied by the owner.
- The page does not collect IC, banking details, documents or payments.

## Round-2 UI/UX implementation — 28 September 2026

- Catalogue search is now global when text is entered, regardless of the selected category.
- Search supports common aliases including `aircond`, `air con`, `fridge`, `washer`, `dryer`, `seterika`, `combo` and `kombo`.
- Search results show each product's category so a global result is not mistaken for the previously selected category.
- `Bayaran penuh + Kombo` now renders one category-level RTO-only state instead of ten repeated unavailable cards.
- Product cards no longer automatically enlarge the first product in a selected category. All products use equal hierarchy unless a future documented merchandising rule is added.
- RTO card pricing is now a compact row summary: first period, later period where applicable and total commitment.
- Eligible campaign products receive a restrained `PROMO · 6 BULAN PERTAMA` marker.
- The detail dialog now separates **payment method** (`RTO / Bayaran penuh`) from **RTO plan** (`Basic / Premium / Standard`).
- Changing payment method inside the dialog synchronizes the catalogue's global payment mode.
- Products with both cash and RTO pricing show a compact comparison explaining that RTO totals may include plan-specific service/protection benefits.
- The process and FAQ explicitly tell customers **not to send NRIC photos, card numbers or payment details directly to the agent in chat**. KHIND's official process uses WhatsApp-delivered links for NRIC verification and first payment.
- Generic WhatsApp prompts now use clean multiline fields instead of underscore placeholders.
- Combo artwork is decorative for screen readers because the adjacent heading already identifies both products.
- Product imagery now uses `mix-blend-mode: normal` to preserve appliance colour fidelity.
- Mobile section navigation is sticky at ≤720 px.
- Category labels use at least 12.5 px on mobile and switch to two columns at ≤390 px.
- Decision chips were tightened; combo chips now emphasize included RTO support rather than repeating tenure.
- Source-verification metadata is attached to each product: `source`, `sourceDate`, `campaignSource`, `tenure`, and `verifiedDate`.

## Critical product-data discrepancy

Current public KHIND pages checked on **28 September 2026** visibly conflict with the current agent catalogue for at least two products:

### WM1248

Public KHIND page currently displays:
- Rental plan: RM85/month
- Outright purchase: RM3,500
- “Hak milik penuh selepas 3 Tahun”

Current agent catalogue used by this site:
- Standard RTO rate: RM85/month
- September campaign pricing where applicable
- Tenure: **48 months**

### DHP90

Public KHIND page currently displays:
- Rental plan: RM85/month
- Outright purchase: RM4,000
- “Hak milik penuh selepas 3 Tahun”
- RTO general warranty described elsewhere on the same public page as 3 or 4 years depending on plan

Current agent catalogue used by this site:
- Standard RTO rate: RM85/month
- Campaign logic including the dated October–December offer
- Tenure: **48 months**

**The repository does not contain enough evidence to decide which tenure is commercially authoritative.** The UI now flags this discrepancy rather than silently presenting the two sources as consistent.

Definition of done for this issue:
1. KHIND confirms the applicable tenure for WM1248 and DHP90 in writing.
2. Retain the confirmation/memo reference internally.
3. Update `catalogue.js` so `tenure`, campaign calculation and public-source wording agree.
4. Remove the customer-facing source-conflict warning only after the data is reconciled.

Do not guess 36 or 48 months based only on one source.

## Manual compliance gate

The previously researched agent-agreement clause 7.1 requires prior KHIND written consent for independently created advertising.

**This repository still does not contain evidence that the written consent has been obtained.** The page being live or indexed must not be treated as proof of approval. If consent already exists, retain the approval date/reference internally and record it here.

Do not increase paid promotion until this status is known.

## Content checks still required

Confirm stock, final first-payment amount, promotional eligibility, tenure, warranty wording and fee exclusions against current KHIND documentation. No promotional stacking is assumed. CD12D still has no confirmed price. WD1438's separate Sabah offer remains unverified. No exact delivery date, guaranteed approval or Shariah certification is claimed.

Public product photographs are referenced directly from KHIND's CDN. WD1438 and CD12D use model-name fallbacks because no matching public image has been verified. ACSON photographs represent the Kool series rather than verified visual differences between horsepower variants.

## Validation

- `script.js` compiles after the round-2 implementation.
- Search logic ignores category while a search term is active and indexes product keywords.
- Cash + Kombo uses one RTO-only empty state.
- Dialog payment mode synchronizes with the global payment selector.
- Arbitrary first-product featuring has been removed from rendering logic.
- Product cards use compact RTO rows and display promo eligibility only when campaign logic is active.
- Mobile CSS provides sticky section navigation and a two-column category layout at ≤390 px.
- Combo images use empty alt text.
- Product/hero imagery renders with normal blend mode.
- Existing reduced-motion handling, native `<dialog>`, `<details>` FAQ, skip link, visible focus and `aria-pressed` filter states remain intact.

## Deferred intentionally

### Guided product finder

Not implemented in this pass. It depends on trustworthy product suitability data, especially room-size guidance for AC and current tenure/campaign data. Building it before the critical data reconciliation would create confident recommendations from an unresolved source base.

### Shareable URL filter state

Not implemented. This remains a low-priority convenience feature and is not needed to solve the current discovery/conversion issues.

## Next checkpoint

The current Q3 promotion ends on **30 September 2026**. Before **1 October 2026**, reconcile WM1248/DHP90 tenure with KHIND and review the October campaign state, displayed pricing, warranty wording and stock notes.
