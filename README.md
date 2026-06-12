# QR Studio Developer Guide

QR Studio is a portable QR code generator for creating polished, branded QR codes. It supports typed, pasted, and dragged URLs; center images; interactive icon placement; safe center area controls; personal inscriptions; QR style variants; color themes; PNG export; a Chrome Extension package; Electron desktop shells; and Capacitor mobile scaffolding.

Developer: Shu-Yen Wan  
Current version: 1.1.2  
Copyright: Copyright (c) 2026 Shu-Yen Wan

## Project Status

This repository was repaired after local Git metadata and original editable source files were damaged. The current repository is functional and buildable, but the main app implementation in `src/recovered-app.js` was reconstructed from the surviving production bundle. Treat it as recovered source rather than the original hand-written source.

The repo currently builds the web app and Chrome Extension package successfully.

## Product Scope

QR Studio generates QR codes locally in the browser. Its core user experience is a compact editor with a live QR preview and export controls.

Key capabilities:

- Generate QR codes from typed, pasted, or dragged URLs.
- Import a center image or logo by file selection or drag-and-drop.
- Scale the center image beyond 100 percent, crop overflow inside the safe center area, and drag the icon into focus.
- Show a dotted guide for the safe center area.
- Adjust the safe center area from none to a large scan-conscious center blank.
- Add a short personal inscription with optional center image.
- Move inscription text within the safe center area.
- Adjust inscription text size and text color.
- Warn users when an inscription is too large or likely to harm scan reliability.
- Choose QR module styles while preserving the square style as default.
- Choose polished color themes.
- Export or copy the QR code as PNG.
- Package as a Chrome Extension.
- Package as Electron desktop apps.
- Sync the web build into Capacitor Android and iOS projects.

## Repository Map

| Path | Purpose |
| --- | --- |
| `index.html` | Vite app entry point and metadata. |
| `src/main.js` | Imports recovered styles and app bundle. |
| `src/recovered-app.js` | Recovered QR Studio application logic from the production bundle. |
| `src/styles.css` | Recovered app styling. |
| `chrome-extension/` | Chrome Extension popup, manifest, icons, and extension background/update logic. |
| `chrome-web-store/` | Chrome Web Store listing draft and graphic assets. |
| `electron/main.cjs` | Electron desktop wrapper for macOS and Windows builds. |
| `android/` | Capacitor Android project scaffold. |
| `scripts/package-chrome.mjs` | Builds and zips the Chrome Extension package. |
| `test-assets/` | Test-only images and fixtures. |
| `dist/` | Generated web build output. Ignored by Git. |
| `release/` | Generated installers and packages. Ignored by Git. |
| `node_modules/` | Installed dependencies. Ignored by Git. |

## Toolchain

Runtime and build tools:

- Node.js and npm
- Vite for the web app
- `qrcode` for QR generation logic
- Electron and electron-builder for desktop packaging
- Chrome Extension Manifest V3
- Capacitor for Android and iOS scaffolding

Dependencies are declared in `package.json`.

## Common Commands

Install dependencies:

```bash
npm install
```

Start the web development server:

```bash
npm run dev
```

Build the web app:

```bash
npm run build
```

Preview the production web build:

```bash
npm run preview
```

Run the Electron desktop shell:

```bash
npm run electron
```

Build macOS and Windows desktop packages:

```bash
npm run dist
```

Build only macOS packages:

```bash
npm run dist:mac
```

Build only Windows packages:

```bash
npm run dist:win
```

Build the Chrome Extension zip:

```bash
npm run package:chrome
```

Sync the web build into Capacitor native projects:

```bash
npm run cap:sync
```

Open Android project:

```bash
npm run android:open
```

Open iOS project:

```bash
npm run ios:open
```

## Distribution Targets

### Web

The web deployment target is the generated `dist/` folder. It can be deployed to any static host, including IIS, nginx, Apache, GitHub Pages, Netlify, Vercel, or Cloudflare Pages.

For local network preview:

```bash
npm run build
npx vite preview --host 0.0.0.0 --port 4173
```

Then open:

```text
http://localhost:4173
```

Or, from another device on the same network:

```text
http://YOUR_COMPUTER_IP:4173
```

### Chrome Extension

The Chrome Extension lives in `chrome-extension/`.

Build the zip:

```bash
npm run package:chrome
```

The generated upload package is:

```text
release/QR Studio Chrome Extension 1.1.2.zip
```

For development in Chrome:

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Select Load unpacked.
4. Choose the `chrome-extension/` folder.

The unpacked folder must stay in place while Chrome uses it. A packed extension installed from the Chrome Web Store does not depend on your local folder.

### Electron Desktop

The `electron/` folder is required for native desktop packaging. Keep it if macOS or Windows installers are still part of the product.

Electron packaging uses:

```text
electron/main.cjs
```

and the `build` section of `package.json`.

Remove Electron only if the project will no longer produce desktop apps. If removed, also delete the Electron scripts, Electron dependencies, and electron-builder configuration.

### Android and iOS

The `android/` directory is a Capacitor project scaffold. Generated native build folders should stay out of Git.

Use:

```bash
npm run cap:sync
```

Then open the platform project with Android Studio or Xcode.

Chrome Extensions do not install into Chrome on iPadOS in the same way as desktop Chrome. For iPad, use the web app, a home-screen web shortcut, or a native iOS/iPadOS Capacitor build.

## Chrome Web Store Materials

Prepared assets live in `chrome-web-store/`:

- `store-icon-128.png`
- `screenshot-0-real-app-1280x800.png`
- `screenshot-1-main-workspace-1280x800.png`
- `screenshot-2-style-options-1280x800.png`
- `small-promo-tile-440x280.png`
- `marquee-promo-tile-1400x560.png`
- `chrome-web-store-listing.md`

## Versioning

The version should stay synchronized across:

- `package.json`
- `chrome-extension/manifest.json`
- app-visible copyright/version text
- Chrome Web Store listing text
- generated package names in `release/`

Current version:

```text
1.1.2
```

## Git and Recovery Notes

This repository was restored with a recovery commit after the local `.git` folder was lost.

Before force-pushing to GitHub, inspect the remote repository carefully. If GitHub still contains cleaner original source files, prefer preserving that history and merging intentionally.

Safer force push command, only after inspection:

```bash
git push --force-with-lease origin main
```

Avoid plain `git push --force` unless you are deliberately replacing the remote branch and have a backup.

## Clean Artifact Policy

Generated output should not be committed:

- `node_modules/`
- `dist/`
- `release/`
- `chrome-extension/app/`
- Android Gradle build folders
- local `.DS_Store` files

Test-only image fixtures belong in:

```text
test-assets/
```

## Maintenance Checklist

Before shipping a new version:

1. Update version values.
2. Run `npm install` if dependencies changed.
3. Run `npm run build`.
4. Run `npm run package:chrome`.
5. Test the web app in a browser.
6. Test the Chrome Extension as unpacked.
7. Test Electron if desktop packages are being shipped.
8. Sync Capacitor if Android or iOS builds are being shipped.
9. Review generated release artifacts.
10. Commit source and configuration changes.

## Design Principles

QR Studio should remain:

- Local-first and privacy-conscious.
- Compact enough for repeated production use.
- Visually polished without hiding the QR code’s scannability constraints.
- Honest about safe center area limits.
- Easy to package and migrate.
- Clear about what is source, what is generated, and what is release output.

## Companion Visual Guide

Open `repo-vitality.html` in a browser for an interactive visual overview of the repository, build paths, deployment targets, and recovery status.
