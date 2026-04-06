# Sandbox Group LLC — Landing Page

Sandbox Group LLC is the parent company to Sandbox-GTM, Sandbox-XM, FORGE by Sandbox, and Forge Intelligence.

## Files

| File | Purpose |
|---|---|
| `index.html` | Main landing page (single-file, no build step) |
| `styles.css` | Stylesheet — light mode only, institutional design |
| `assets/` | Place company logo files here (see below) |

## Adding Logos

Drop logo files into the `assets/` directory and uncomment the corresponding `<img>` tags in `index.html`:

| Company | Expected filename | `<img>` location in `index.html` |
|---|---|---|
| Sandbox GTM | `assets/logo-sandbox-gtm.svg` | GTM brand card |
| Sandbox XM | `assets/logo-sandbox-xm.svg` | XM brand card |
| FORGE by Sandbox | `assets/logo-forge.svg` | FORGE brand card |
| Forge Intelligence | `assets/logo-forge-intelligence.svg` | Forge Intelligence brand card |

SVG is preferred for crispness at all screen sizes. PNG also works.

## Running locally

Open `index.html` directly in a browser, or serve with any static server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Design notes

- **Persistently light mode** — `color-scheme: light` is set on `<html>`; no dark-mode media queries exist.
- Typography: [Inter](https://fonts.google.com/specimen/Inter) (sans) + [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (display), loaded from Google Fonts.
- Palette: white/off-white backgrounds, deep navy (`#0B1F3A`) primary, warm gold (`#C8A96E`) accent.
- No JavaScript — fully static, zero dependencies.
