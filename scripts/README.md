Convert images to WebP

This script converts JPG/PNG images under the `images/` folder into WebP format (keeps originals).

Requirements
- Node.js (14+)
- Run `npm install sharp glob minimist` in the project root

Usage

From project root:

```powershell
npm install sharp glob minimist
node scripts/convert-images-to-webp.js --quality=80
```

Options
- `--quality` or `-q`: WebP quality (0-100). Default 80.
- `--search` or `-s`: Glob pattern to match images. Default `images/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}`.
- `--force` or `-f`: Force regenerate even if `.webp` exists and is newer.

After running
- The script writes `.webp` files next to original images, preserving folder structure.
- Confirm visually or run Lighthouse to measure improvements.
