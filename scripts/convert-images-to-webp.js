#!/usr/bin/env node
const sharp = require('sharp');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

const argv = require('minimist')(process.argv.slice(2), {
  alias: { q: 'quality', s: 'search', f: 'force' },
  default: { quality: 80, search: 'images/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}', force: false }
});

const quality = parseInt(argv.quality, 10) || 80;
const pattern = argv.search;
const force = !!argv.force;

console.log(`Converting images matching: ${pattern}`);
console.log(`WebP quality: ${quality}`);

const files = glob.sync(pattern, { nodir: true });
if (!files.length) {
  console.log('No files found. Check your `images/` folder and the --search pattern.');
  process.exit(0);
}

(async () => {
  for (const file of files) {
    try {
      const parsed = path.parse(file);
      const out = path.join(parsed.dir, parsed.name + '.webp');

      if (!force && fs.existsSync(out)) {
        const inStat = fs.statSync(file);
        const outStat = fs.statSync(out);
        if (outStat.mtimeMs >= inStat.mtimeMs) {
          console.log(`Skipping (up-to-date): ${out}`);
          continue;
        }
      }

      await sharp(file)
        .webp({ quality })
        .toFile(out);
      console.log(`Created: ${out}`);
    } catch (err) {
      console.error(`Failed: ${file}`, err.message || err);
    }
  }
  console.log('Done.');
})();
