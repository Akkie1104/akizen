# KHIND RTO deployment

**Final customer-facing domain:** `https://khindrto.akizen.my/` (planned, not configured yet).

**Current working URL:** `https://akizen.my/khind-rto/` (hosted as a folder of the Akizen GitHub Pages site).

## Deploy as an independent GitHub Pages website

1. Create a separate GitHub repository for KHIND RTO.
2. Put the **contents** of `khind-rto/` in its repository root, including `index.html`, `script.js`, `catalogue.js`, `retail-2026.css`, `style.css`, and `assets/`. Do not publish review PNGs, internal Markdown notes, or development scripts.
3. Enable GitHub Pages on the new repository, and set its Custom domain to `khindrto.akizen.my` under Settings → Pages.
4. At the authoritative DNS provider for akizen.my, create a CNAME named `khindrto` targeting `akkie1104.github.io`. Leave the existing Akizen apex A and `www` records alone.
5. When the new domain and HTTPS certificate are ready, enable Enforce HTTPS.
6. After verifying the subdomain, change `index.html` canonical URL and `og:url` to `https://khindrto.akizen.my/`. Then redirect legacy `/khind-rto/`, `/khind-catalogue/`, and `/khind/` to the new domain.

GitHub Pages does not support a separate custom domain for one subfolder of a repository. The folder rename alone does not activate the subdomain.

Before paid promotion, confirm any KHIND-required written advertising permission. Keep NRIC, banking data and payments off GitHub Pages.
