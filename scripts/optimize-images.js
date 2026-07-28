#!/usr/bin/env node
// Generates responsive WebP + JPEG derivatives for the source photos in images/.
// Source photos are left untouched; derivatives are written as "<name>-<width>w.<ext>".
// Run: node scripts/optimize-images.js
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const WEBP_QUALITY = 75;
const JPEG_QUALITY = 78;
const IMAGES_DIR = path.join(__dirname, '..', 'images');

// Basename (relative to images/, no extension) -> target widths in px.
// Widths wider than the source are skipped automatically (no upscaling).
const MANIFEST = {
  background: [800, 1600],
  background2: [800, 1600],
  pepperonipizza: [480, 960],
  drinks: [480, 960],
  veggie: [480, 960],
  cheesy: [480, 960],
  coke: [480, 960],
  soda: [480, 960],
  'iced-tea': [480, 960],
  perfectpairings: [480, 800, 960, 1400],
  'family feast': [800, 1400],
  twotoppping: [800, 1400],
  sharesnack: [800, 1400],
  'gallery/gall1': [600, 1100],
  'gallery/gall2': [600, 1100],
  'gallery/gall3': [600, 1100],
  'gallery/gall4': [600, 1100],
  'gallery/gall5': [600, 1100],
  'gallery/gall6': [600, 1100],
};

function findSource(base) {
  const dir = path.join(IMAGES_DIR, path.dirname(base));
  const stem = path.basename(base);
  const match = fs.readdirSync(dir).find(f => {
    const parsed = path.parse(f);
    return parsed.name === stem && /^\.(jpe?g|png)$/i.test(parsed.ext);
  });
  if (!match) throw new Error(`No source image found for "${base}" in ${dir}`);
  return path.join(dir, match);
}

function slug(base) {
  const dir = path.dirname(base);
  const stem = path.basename(base).toLowerCase().replace(/\s+/g, '-');
  return dir === '.' ? stem : `${dir}/${stem}`;
}

(async () => {
  const summary = [];

  for (const [base, widths] of Object.entries(MANIFEST)) {
    const src = findSource(base);
    const meta = await sharp(src).metadata();
    const outStem = slug(base);
    const usableWidths = [...new Set(widths.map(w => Math.min(w, meta.width)))].sort((a, b) => a - b);

    const generated = [];
    for (const w of usableWidths) {
      const webpOut = path.join(IMAGES_DIR, `${outStem}-${w}w.webp`);
      const jpgOut = path.join(IMAGES_DIR, `${outStem}-${w}w.jpg`);

      await sharp(src)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(webpOut);

      await sharp(src)
        .resize({ width: w, withoutEnlargement: true })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
        .toFile(jpgOut);

      generated.push({ width: w, webp: webpOut, jpg: jpgOut });
    }

    summary.push({ base, src, sourceWidth: meta.width, generated });
  }

  console.log('\n=== Generated responsive derivatives ===');
  for (const item of summary) {
    console.log(`\n${item.base} (source: ${path.relative(IMAGES_DIR, item.src)}, ${item.sourceWidth}px wide)`);
    for (const g of item.generated) {
      const webpSize = (fs.statSync(g.webp).size / 1024).toFixed(0);
      const jpgSize = (fs.statSync(g.jpg).size / 1024).toFixed(0);
      console.log(`  ${g.width}w -> ${path.basename(g.webp)} (${webpSize}KB), ${path.basename(g.jpg)} (${jpgSize}KB)`);
    }
  }
  console.log('\nDone.');
})();
