# Yellow Captain — Website

Simple static site for the Yellow Captain pizza restaurant.

## What I changed
- Improved accessibility and focus styles.
- Added a bright yellow theme via CSS variables (`styles.css`).
- Reworked hero and gallery images to use `<picture>` + WebP with `srcset` and `sizes`.
- Added a `scripts/convert-images-to-webp.js` helper to produce `.webp` assets locally.
- Added a lightweight `images/favicon.svg` and set `fetchpriority="high"` on hero LCP images.
- Ensured all external `target="_blank"` links use `rel="noopener noreferrer"`.

## Requirements
- Node.js (16+ recommended)
- npm
- Google Chrome (for Lighthouse)

## Quick local commands
Install node deps (used by the conversion script):

```
npm install
npm install sharp glob minimist --no-audit --no-fund
```

Convert images to WebP (quality 80):

```
node scripts/convert-images-to-webp.js --quality=80
```

Run Lighthouse (example):

```
npx lighthouse "file:///C:/Users/deveh/Desktop/client_projects/yellow_captain/index.html" --output html --output-path ./lighthouse-index.html --chrome-flags="--headless"
```

Open the site locally in Chrome to preview: open `index.html` in the browser or serve the folder with a simple static server:

```
# using npm package 'http-server'
npm install -g http-server
http-server -c-1 .
# then open http://localhost:8080
```

## How to push this folder to GitHub (your repo)
Replace `YOUR_REMOTE_URL` with `https://github.com/DEVE123-dev/Yellow-captain-website.git` (or use your SSH remote).

```
git init
git add .
git commit -m "Initial site: accessibility, images, favicon, README"
git branch -M main
git remote add origin https://github.com/DEVE123-dev/Yellow-captain-website.git
# If you have SSH setup, use the SSH URL instead
# git remote add origin git@github.com:DEVE123-dev/Yellow-captain-website.git

git push -u origin main
```

Notes on authentication:
- If using HTTPS, generate a Personal Access Token (PAT) and use it instead of your password when prompted.
- If you prefer not to enter credentials each push, set up SSH keys and use the SSH remote.

## Next recommended steps
- Run Lighthouse and attach `lighthouse-index.html` here so I can implement the prioritized fixes.
- Add a tiny CI (GitHub Actions) to produce `.webp` on push if you want automated conversion.

---
Created by the local assistant. If you want, I can attempt to run `git` commands here — however pushing requires your GitHub credentials/SSH agent configured. Tell me if you want me to try pushing from this environment.