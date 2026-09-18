# Jira Unsuckify — Brand Assets

## icons/  (Chrome extension)
Drop into the extension's `icons/` folder. Required by Chrome: 16, 32, 48, 128.
256/512 are for the Web Store listing and any high-DPI needs; `icon-master-1024.png` is the source for regenerating.

manifest.json:
```json
"icons": { "16": "icons/icon16.png", "32": "icons/icon32.png", "48": "icons/icon48.png", "128": "icons/icon128.png" },
"action": { "default_icon": { "16": "icons/icon16.png", "32": "icons/icon32.png", "48": "icons/icon48.png", "128": "icons/icon128.png" } }
```

## favicon/  (popup / options pages, website)
```html
<link rel="icon" href="favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
```
`icon-192.png` / `icon-512.png` are for a web manifest if you ever ship a landing page as a PWA.

## logo/
- `logo-full-transparent*.png` — illustration + wordmark, transparent background (master + 1200w + 600w)
- `logo-wordmark-transparent*.png` — wordmark only, transparent (master + 1200w + 600w)
- `logo-illustration-transparent*.png` — illustration only, transparent (master + 400w)
- `logo-full-lightbg.png` / `logo-full-darkbg.png` — flattened versions for places that don't support alpha

## store/  (Chrome Web Store listing)
- `small-promo-tile-440x280.png` — required small promo tile
- `marquee-promo-tile-1400x560.png` — optional marquee tile
- `hero-1280x800.png` — usable as a first screenshot/hero; real screenshots should be 1280x800 or 640x400
