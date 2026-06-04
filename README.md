# PureData⇋Data

A static Vite site for archiving Pure Data workshop patches on GitHub Pages.

## Local workflow

```powershell
npm.cmd install
npm.cmd run compile-patches
npm.cmd run dev
npm.cmd run build
npm.cmd run preview
```

PowerShell may block `npm.ps1`, so use `npm.cmd` on Windows.

## Adding a participant patch

1. Put the Pd file at `public/patches/{id}/main.pd`.
2. Add an entry to `src/content/patches.json`.
3. Run `npm.cmd run compile-patches`.
4. Run `npm.cmd run build`.

The compiler writes WebPd output to `public/compiled/{id}/` and updates playback status in `src/content/patches.json`.

## GitHub Pages

This project builds into `docs/`. In the repository settings, set Pages to deploy from the `main` branch and `/docs` folder. The build also copies `public/.nojekyll` into `docs/.nojekyll`.
