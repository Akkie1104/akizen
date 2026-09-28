# KHIND customer page

Prepared 27 September 2026 for Akizen's `/khind/` route and updated 28 September 2026 after a UI/UX audit. Static HTML/CSS/JavaScript; no build step.

## Current state

- Published at `https://akizen.my/khind/`.
- Search indexing is enabled intentionally.
- Single-page funnel remains: discovery → collection → product details → WhatsApp → KHIND process.
- Bahasa Melayu catalogue: 13 individual models and 10 bundle choices.
- Product-specific WhatsApp enquiries use **0174201247 / 60174201247**, supplied by the owner.
- The page does not collect IC, banking details, documents or payments.

## 28 September UI/UX implementation

- RTO cards now show the first monthly rate, later rate where applicable, contract period and **estimated total including the RM1 processing fee**.
- `Semua` is now **Semua model** because bundles remain a separate category.
- Payment wording now follows the reviewed public KHIND wording: debit or credit card rather than the broader “account or card”.
- Mobile now keeps direct section navigation for Koleksi, Cara RTO and FAQ.
- Mobile category controls wrap into a visible grid instead of hiding additional categories in a scrollbar-free horizontal strip.
- Outright-price mode no longer silently falls back to RTO when an outright price is unavailable.
- Independent-agent/payment-through-KHIND disclosure is visible near the hero, not only in the footer.
- Cards include a small set of decision cues; WM1248 includes the reviewed 3–5-person suitability and 598 × 608 × 845 mm dimensions.
- Internal links/dialog actions no longer use the external-link arrow; `↗` is reserved for WhatsApp and official external sources.
- Mobile contract/stock text and key touch targets were enlarged.
- Category storytelling is compact on mobile.
- Bundle cards compose verified official product photos rather than using text-only placeholders.
- Generic WhatsApp enquiries now prompt for need, area and monthly budget.
- Search includes an explicit clear control.
- Hero image failure handling now matches catalogue resilience.
- The former ~1.9 MB `studio-sage.png` decorative background was removed. The same sage studio direction is recreated with CSS gradients, eliminating that download.

## Manual compliance gate

The previously researched agent-agreement clause 7.1 requires prior KHIND written consent for independently created advertising.

**This repository does not contain evidence that the written consent has been obtained.** The page being live or indexed must not be treated as proof of approval. The owner should confirm and retain KHIND's written consent before further promotion. If consent has already been obtained elsewhere, record the approval date/reference here.

This is a manual business/compliance check, not something the website code can verify.

## Content checks still required

Confirm stock, the final first-payment amount, promotional eligibility and any fee exclusions against current KHIND documentation. No promotional stacking is assumed. CD12D has no confirmed price; WD1438's RM1,899 Sabah offer remains labelled as an unconfirmed separate offer with one-year warranty. No exact delivery date, guaranteed approval or Shariah certification is claimed.

Public product photographs are referenced directly from KHIND's CDN. WD1438 and CD12D still use model-name fallbacks because no matching public image was verified. Bundle compositions reuse the same verified product photos without modifying the appliances. ACSON photographs represent the Kool series, not a verified visual distinction between horsepower variants. External image availability still depends on KHIND's hosting.

Internal research and PDFs remain outside this repository. Do not publish them. Public product-page links remain in `catalogue.js`, and the official KHIND FAQ remains linked from the page.

## Validation

- JavaScript compiled successfully after the audit implementation.
- Pricing-card logic exposes estimated totals including the RM1 processing fee.
- Cash-mode unavailable state was checked to remain in cash mode.
- Mobile section navigation and 3 × 2 category layout are present at the ≤720 px breakpoint.
- Search reset, hero fallback, combo-photo composition and 44 px touch targets are implemented.
- The retired `studio-sage.png` is no longer referenced by CSS and has been removed from the repository.
- Reduced-motion handling, labelled controls, skip link, native `<dialog>`, `<details>` FAQ, visible focus and `aria-pressed` category buttons remain intact.

## Next dated QA checkpoint

The Q3 promotion and outright-price campaign currently end on **30 September 2026**. On **1 October 2026**, recheck live pricing, campaign wording, stock notes and the displayed review date against current KHIND information. The page's campaign code changes state automatically, but the underlying commercial information still requires a human review.
