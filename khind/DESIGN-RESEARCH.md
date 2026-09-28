# KHIND page redesign research
Status: confirmed observations; exploratory design interpretation
Reviewed: 2026-09-28

## Research route
Mobbin MCP was attempted first. It returned "Mobbin MCP requires a paid plan" and supplied no references. The user explicitly approved direct website research instead. No Mobbin findings are claimed.

## Live references inspected before editing
- [BALMUDA](https://www.balmuda.com/jp/): visually inspected the kettle hero. Large product photography, restrained navigation, substantial negative space, and one clear product story. Adopted the image emphasis and restraint; no photography or source code copied.
- [Fisher & Paykel Asia](https://www.fisherpaykel.com/asia/) and [Laundry](https://www.fisherpaykel.com/asia/laundry/): visually inspected the full-width appliance/environment hero, thin typography, category links and explanatory copy beneath. Adopted an appliance-led hero and a clearer progression from inspiration to collection.
- [KHIND RTO](https://www.khindrto.com.my/): visually inspected the yellow/charcoal brand treatment and Malay, household-oriented messaging. Adopted yellow accents and a practical local tone. This is a visual reference, not a revalidation of every commercial term.
- [Existing agent page](https://akizen.my/khind/): inspected live before editing; dense cards, cream/green surfaces and undersized imagery. Existing catalogue, temporal campaigns and source-conflict disclosures retained.

## Design decisions
Use an ivory, charcoal and KHIND-yellow palette, a large typographic hero, enlarged existing product imagery on a studio-like CSS backdrop, illustrated category buttons, unboxed product cards and clearly separated introductory/monthly/total payments. Rebuild responsive styling in the existing vanilla HTML/CSS/JavaScript stack. No new runtime dependencies.

Keep agent disclosure prominent. Keep the model search, categories, cash/RTO comparison, modal plan selection, stock notes, official-source links, expiry logic and WhatsApp destinations. The hero laundry link now selects the laundry category. New copy is a local draft pending review; no live publication performed.

The backdrop is graphic styling, not a photograph of an actual showroom. Existing official product image URLs are reused; no competitor assets are incorporated. Products without source images retain explicit fallbacks.

## Validation
- JavaScript syntax: node --check khind/script.js passed.
- Browser: desktop, 390px mobile, 320px narrow viewport inspected; no document horizontal overflow at tested sizes.
- Fridge filter: 3 products.
- Cross-category WM1248 search: 2 results (individual model plus matching combo).
- WM1248 modal: RTO total RM3,826 and cash RM3,000 displayed for the current campaign; retained source-conflict note. This checks rendering, not commercial accuracy.
- Cash-mode bundles: RTO-only explanatory state and switch back to 10 bundles worked.
- Hero laundry link: 6 products.
- Empty search and clear-search recovery worked.
- Mobile modal: no internal horizontal overflow.
- No browser console errors reported in the inspected session.
- Product catalogue data unchanged.
- Live site not deployed. Local branch: codex/khind-showroom-redesign.

## Review
Run a static server from the repository root and open /khind/. The review session uses http://127.0.0.1:8765/khind/.
See redesign-desktop.png for the reviewed desktop hero.

## Second pass: Impeccable + Taste Skill
Reviewed: 2026-09-28. User explicitly requested installation and application of both repositories.

Installed with the official Codex skill installer:
- Impeccable: ~/.codex/skills/impeccable, pinned upstream commit 9d715cc4f5564a990ca8345abfdd5df6dc9b41c8.
- Taste: ~/.codex/skills/taste-skill, pinned upstream commit ce26fc25c0e5e8cab638f883de62d9a86ee5e45b.
Existing vendor-prefixed skill copies were left intact. Both new skills can be discovered on the next turn. Impeccable's optional executable launcher was not run; its documented direct-context fallback was used. No hooks were enabled.

Applied the redesign audit, typography and visual hierarchy guidance, craft-floor checks, responsive handling and reduced-motion requirements. See DESIGN.md for the interpretation and explicit dial values. Replaced the platform display font with self-hosted Manrope, enlarged the appliance composition on KHIND yellow, removed decorative heading labels and the added brand dot, used product-image categories and licensed Tabler icons, simplified catalogue lead-ins, moved promotional labels off images, added system-aware theme switching, and removed the now-unused blanket reveal observer.

Font: Manrope variable Latin WOFF2, 24,836 bytes, SIL Open Font License. Icons: Tabler v3.35.0, MIT. Licenses included in assets. Product imagery and catalogue data remain sourced from the existing catalogue.

Second-pass checks:
- Syntax and git diff --check passed.
- Self-hosted Manrope loaded in browser.
- Desktop, 390px and 320px document widths checked without horizontal page overflow.
- Mobile heading occupies two lines; modal has no horizontal overflow.
- Fridge filter 3 models; WM1248 search 2 matches; laundry hero shortcut 6 models.
- Current-campaign WM1248 RTO total RM3,826 and cash RM3,000 rendered; bundle cash-state recovery showed 10 bundles.
- Empty search and clearing recovered correctly.
- Light/dark toggle changes rendered theme; no console errors observed.
- Sampled light-theme contrasts: hero intro 6.18:1, hero CTA 14.99:1, header CTA 14.55:1, catalogue secondary text 5.83:1, input text 15.13:1. These samples are not a complete accessibility certification.
- Lighthouse CLI was not installed in this environment, so no Lighthouse or Core Web Vitals score is claimed.
- No production deployment.

Screenshots: refined-desktop.png and refined-mobile.png.

