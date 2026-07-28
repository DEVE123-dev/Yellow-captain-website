# Image optimisation script

`optimize-images.js` generates responsive WebP + JPEG derivatives for the source
photos in `images/`. Each source photo produces one or more `<name>-<width>w.webp`
and `<name>-<width>w.jpg` files, sized for where that photo is actually used on
the site (hero banners, menu cards, gallery tiles). Source photos are never
overwritten, so they remain available if you need to regenerate at different
sizes later.

## Requirements

- Node.js 18+
- npm

## Usage

Install dependencies once:

```bash
npm install
```

Regenerate every derivative:

```bash
npm run images:optimize
```

Or call the script directly:

```bash
node scripts/optimize-images.js
```

## Adding a new photo

1. Drop the source JPG/PNG into `images/` (or `images/gallery/`).
2. Add an entry to the `MANIFEST` object at the top of `optimize-images.js` with
   the target widths (in pixels) that the photo needs — check how wide it will
   ever be rendered on the page and pick one or two widths that cover mobile and
   desktop.
3. Run `npm run images:optimize`.
4. Reference the generated `-<width>w.webp` / `-<width>w.jpg` files from a
   `<picture>` element in the relevant HTML page (see any existing `menu-card`
   or `gallery-card` for the pattern).

Widths larger than the source image are skipped automatically — the script
never upscales.
