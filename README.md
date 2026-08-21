# Akizen.my production static site

## Upload
Upload **all files and folders inside this ZIP** to the document root for `akizen.my` (commonly `public_html`).

## Test before launch
Run locally with:

```bash
python -m http.server 8080
```

Then open:
- `http://localhost:8080/`
- `http://localhost:8080/test.html`

The test page checks the homepage, CSS, JavaScript, images, manifest, sitemap, robots file and 404 page.

## Before public launch
1. Replace `hello@akizen.my` in `index.html` and `script.js` if that mailbox does not exist.
2. Confirm the canonical domain is exactly `https://akizen.my/`.
3. Keep `test.html` for private diagnostics or delete it after verification.
4. `.htaccess` is for Apache/LiteSpeed hosting. Other servers can ignore or remove it.

## Included
- Responsive production homepage
- Optimized Akizen logo assets
- Project illustrations
- Favicon + Apple touch icon
- Open Graph social image
- `robots.txt`
- `sitemap.xml`
- `site.webmanifest`
- `404.html`
- `test.html`
- Basic security/cache rules for Apache/LiteSpeed
- Accessible navigation and reduced-motion support

## Client-side navigation
The public site is now a static single-page application using hash routes:

- `#/home`
- `#/services`
- `#/work`
- `#/about`
- `#/contact`

Navigation tabs, home cards, CTA buttons, footer links, and previous/next page buttons all switch views without a full browser refresh. Hash routing was chosen because it works reliably on basic static hosting without special server rewrite rules.
