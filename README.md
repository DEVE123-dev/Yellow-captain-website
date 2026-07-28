# Yellow Captain — Website

Production codebase for the Yellow Captain restaurant website (Vision City Mega
Mall, Port Moresby). This document is the handover reference for both the
client (hosting/domain owner) and any developer who works on the code after
initial delivery.

## Contents

- [Project overview](#project-overview)
- [Features](#features)
- [Development setup](#development-setup)
- [Deployment guide (GitHub + Render)](#deployment-guide-github--render)
- [Maintenance guide](#maintenance-guide)
- [Technical details](#technical-details)
- [Before you launch — placeholders to replace](#before-you-launch--placeholders-to-replace)

---

## Project overview

Yellow Captain is a pizza restaurant at Vision City Mega Mall in Port Moresby,
Papua New Guinea. This site is its public-facing marketing website: a fast,
mobile-friendly way for customers to see the menu, check specials, browse
photos, find opening hours, and get in touch to book a table or ask a
question.

It is a **static site** — plain HTML, CSS, and a small amount of JavaScript,
with no server-side application, database, or user accounts. That's a
deliberate choice: it's fast, cheap to host, has effectively no attack
surface, and is simple enough that a non-technical owner never has to worry
about "the backend going down."

Main pages:

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero, menu highlights, specials carousel, gallery preview, about, location & hours |
| Menu | `menu.html` | Full pizza/drinks menu and combo deals |
| Specials | `specials.html` | Current meal deals |
| Gallery | `gallery.html` | Photo gallery |
| Contact | `contact.html` | Location, hours, map, and a reservation request form |
| 404 | `404.html` | Custom "page not found" page |

## Features

- **Responsive design** — one codebase that adapts from small phones up to
  large desktop monitors, including a dedicated mobile navigation menu.
- **Optimised images** — every photo is served as a right-sized, compressed
  WebP (with an automatically-generated JPEG fallback) instead of a single
  multi-megabyte original. See [Image pipeline](#image-pipeline).
- **Accessibility** — skip-to-content link, visible keyboard focus states,
  `aria-current` on the active nav link, labelled form fields, alt text on
  every image, a pausable auto-rotating carousel (WCAG 2.2.2), and full
  support for `prefers-reduced-motion`.
- **Performance-minded** — no framework, no build step, no render-blocking
  font loading, LCP images marked `fetchpriority="high"` and preloaded,
  everything else lazy-loaded.
- **SEO fundamentals** — unique title/description per page, canonical URLs,
  Open Graph + Twitter Card tags, `Restaurant` structured data (JSON-LD) with
  opening hours, `sitemap.xml`, and `robots.txt`.
- **Restaurant-focused UX** — sticky header with a persistent "Call Now"
  action, hero CTAs that take visitors straight to the menu or booking form,
  and a footer that surfaces hours/address/phone on every page.

## Development setup

### Required software

- A modern web browser (Chrome, Edge, Firefox, or Safari).
- A text editor — [VS Code](https://code.visualstudio.com/) is recommended.
- [Git](https://git-scm.com/).
- [Node.js 18+](https://nodejs.org/) — **only** needed if you're
  adding/replacing photos and want to run the image-optimisation script.
  You don't need Node.js to edit HTML/CSS or preview the site.

### Running it locally

Because this is a plain static site, you can open `index.html` directly in a
browser. For the most accurate preview (some browsers restrict things like
relative-path fetches when opened via `file://`), serve it with a local
static server instead — any of these work and require no project-specific
setup:

```bash
# Option 1: VS Code "Live Server" extension — right-click index.html, "Open with Live Server"

# Option 2: Python (already installed on most Macs/Linux, and on Windows via python.org)
python -m http.server 8080

# Option 3: Node, via npx (no install needed)
npx serve .
```

Then open `http://localhost:8080` (or whichever port the tool prints).

### Installing dependencies

Only needed for the image-optimisation tooling in `scripts/`:

```bash
npm install
```

### Testing changes

There's no automated test suite — it's a marketing site, not an application.
"Testing" means:

1. Preview locally (see above) and click through every page and link.
2. Resize the browser (or use DevTools device emulation) to check mobile,
   tablet, and desktop layouts.
3. Tab through the page with your keyboard to confirm focus order and that
   the skip link, nav, carousel controls, and form are all reachable.
4. Run a Lighthouse audit before shipping anything that touches images, fonts,
   or the `<head>` of a page:

   ```bash
   npx lighthouse http://localhost:8080/index.html --view
   ```

### Image pipeline

Source photos live in `images/` (and `images/gallery/`). They are **not**
referenced directly by any page — instead, `scripts/optimize-images.js`
generates right-sized `.webp` and `.jpg` derivatives (e.g.
`pepperonipizza-480w.webp`, `pepperonipizza-960w.webp`) that the HTML actually
points to via `<picture>`/`srcset`. This is what keeps page weight low despite
the source photos being full-resolution.

To add or replace a photo, see the step-by-step instructions in
[`scripts/README.md`](scripts/README.md).

---

## Deployment guide (GitHub + Render)

The project is set up for a standard **developer-owns-the-code,
client-owns-the-hosting** workflow:

```
Developer GitHub Repository
            |
            v
      Client Render Account
            |
            v
       Client Domain
            |
            v
     Live Yellow Captain Website
```

- The **developer** owns and maintains the GitHub repository and pushes code
  changes.
- The **client** owns the Render account (and its billing), the domain (and
  its renewal), and any other third-party services the site uses (e.g. a form
  backend — see [Contact form](#contact-form)).
- The website never depends on the developer's personal credit card, hosting
  account, or domain registration. If the developer becomes unavailable, the
  client still owns and controls every account the live site depends on.

### This project as a Render Static Site

Render's "Static Site" service type is the right fit here — there is no
server, database, or build step required:

- **Build command:** *(leave blank — nothing to compile)*
- **Publish directory:** `.` (the repository root)

An optional `render.yaml` is included in the repo root for Render's
"Blueprint" auto-setup. It's not required — the manual steps below work
identically and are the more foolproof path if you're not already familiar
with Render Blueprints.

### Step 1 — Connect the GitHub repository to Render

1. The client creates a free [Render](https://render.com) account (or the
   developer creates it and transfers ownership — see
   [Maintenance guide](#maintenance-guide)).
2. In the Render dashboard, click **New +** → **Static Site**.
3. Connect your GitHub account and select this repository
   (`DEVE123-dev/Yellow-captain-website` or wherever it has been transferred
   to).

### Step 2 — Configure the static site

| Setting | Value |
|---|---|
| Name | `yellow-captain` (or anything you like — this becomes part of the default `onrender.com` URL) |
| Branch | `main` |
| Build Command | *(leave empty)* |
| Publish Directory | `.` |

Click **Create Static Site**. Render will pull the repo and publish it — you'll
get a working `https://yellow-captain.onrender.com`-style URL within a minute
or two, before any custom domain is connected.

### Step 3 — Connect the custom domain

1. In the Render dashboard, open the site → **Settings** → **Custom Domains**.
2. Add the domain (e.g. `yellowcaptain.com`) and `www.yellowcaptain.com`.
3. Render will show the DNS records it needs.

### Step 4 — DNS configuration

At your domain registrar (wherever the domain was purchased — GoDaddy,
Namecheap, etc.), add the records Render gives you. Typically:

| Record | Host | Points to |
|---|---|---|
| `A` (or `ANAME`/`ALIAS`) | `@` (root domain) | the IP/target Render provides |
| `CNAME` | `www` | your Render `onrender.com` address |

DNS changes can take anywhere from a few minutes to a few hours to propagate.
Render automatically issues and renews a free TLS certificate once DNS is
verified — no separate SSL purchase is needed.

### Step 5 — Automatic deploys

By default, Render redeploys automatically every time a new commit lands on
the connected branch (`main`). No manual redeploy step is needed after the
initial setup — see the [Maintenance guide](#maintenance-guide) for the full
update workflow.

### Production checklist

Before pointing the real domain at this site, confirm:

- [ ] All [placeholders](#before-you-launch--placeholders-to-replace) below
      have been replaced with real values.
- [ ] The contact form has been tested end-to-end (a real submission arrives
      wherever it's supposed to).
- [ ] Opening hours, phone number, and address are correct on every page.
- [ ] Social links go to the real Yellow Captain profiles.
- [ ] A production Lighthouse run looks healthy (Performance/Accessibility/
      SEO in the 90s is a reasonable bar for a static site like this).
- [ ] Custom domain is connected and serving HTTPS (padlock in the browser).

---

## Maintenance guide

**Initial development** (this delivery) includes the completed website and
its deployment setup — connecting the repo to Render and getting the site
live on the client's account.

**Future updates** — menu/price changes, new photos, new promotions, updated
hours, new pages, online ordering or booking integrations, marketing changes,
redesigns — are separate work unless covered by an ongoing maintenance
agreement. The codebase is intentionally simple (plain HTML/CSS/JS, no
build system) specifically so that this kind of update stays cheap and fast
to deliver.

### How an update happens

```
Client requests a change
          |
          v
Developer updates the code
          |
          v
Changes are pushed to GitHub
          |
          v
Render automatically deploys the update
          |
          v
Website is updated (usually within a minute or two)
```

### What requires developer involvement

Anything that means editing code: menu/price/copy changes, new sections or
pages, design changes, adding a booking/ordering integration, etc. This
repository has no CMS or admin panel — content lives directly in the HTML —
so there's no self-service editing UI for the client. (If ongoing self-service
content editing becomes a priority, that's a reasonable future enhancement to
scope separately — e.g. moving menu data into a small JSON file, or adopting a
headless CMS — but it isn't part of this delivery.)

### What belongs to the client

- Render account and hosting plan (the free tier is normally sufficient for a
  static site like this; paid tiers only matter for custom needs like
  removing Render branding delays on cold starts, which don't apply to static
  sites anyway).
- Domain registration and renewal.
- Any third-party service the site uses — currently just the contact form
  backend (see below), which has a free tier.
- Social media accounts and their content.

### Contact form

The reservation form on `contact.html` posts to
[Formspree](https://formspree.io), a third-party form backend that emails
submissions to a real inbox without needing a server of our own. Formspree's
free tier (50 submissions/month) is normally enough for a single restaurant's
reservation requests. To activate it:

1. The client (or developer, on the client's behalf) creates a free Formspree
   account using the restaurant's real email address.
2. Create a new form and copy its endpoint URL.
3. In `contact.html`, replace `https://formspree.io/f/YOUR_FORM_ID` with that
   URL.
4. Commit, push, and Render redeploys automatically.

Until that's configured, the form will not deliver submissions — the phone
and WhatsApp links elsewhere on the site remain the reliable fallback in the
meantime. This is a deliberate zero-backend approach: no server code to
maintain, no hosting cost beyond the free tier, and the client owns the
account it depends on.

---

## Technical details

### Folder structure

```
yellow_captain/
├── index.html          Home page
├── menu.html            Full menu
├── specials.html        Meal deals
├── gallery.html          Photo gallery
├── contact.html          Location, hours, map, reservation form
├── 404.html              Custom not-found page
├── styles.css            Single shared stylesheet (design system + layout)
├── main.js               Mobile nav, scroll-reveal, carousel, form UX
├── robots.txt
├── sitemap.xml
├── render.yaml            Optional Render Blueprint config
├── images/                Source photos + generated responsive derivatives
│   └── gallery/
├── scripts/
│   ├── optimize-images.js Generates the responsive image derivatives
│   └── README.md           How to add/replace a photo
├── package.json            Dev-only tooling dependencies (not shipped to production)
└── README.md                This file
```

### Technologies used

- **HTML5** — semantic elements (`header`, `nav`, `main`, `article`,
  `footer`), one `<h1>` per page, structured heading hierarchy.
- **CSS3** — custom properties (design tokens) for color/spacing/radius/
  shadow, CSS Grid and Flexbox for layout, no framework.
- **Vanilla JavaScript** — no framework, no bundler. `main.js` handles the
  mobile nav toggle, scroll-reveal animation, the specials carousel
  (including pause/play and reduced-motion handling), and small reservation
  form UX touches.
- **Node.js + sharp** — dev-only tooling to generate responsive image
  derivatives. Not required to run or deploy the site.

There is intentionally no framework, bundler, or build step. For a five-page
marketing site, that keeps things fast, keeps the developer surface small,
and means Render never has to run an `npm install`/build to publish it —
plain files, published directly.

### Browser compatibility

Targets modern evergreen browsers (Chrome, Edge, Firefox, Safari — desktop
and mobile). WebP images are used with an automatic JPEG fallback via
`<picture>` for any browser that doesn't support WebP. No support for
Internet Explorer.

### Performance optimisations

- Every content photo is served through a responsive `<picture>`/`srcset`
  pipeline (see [Image pipeline](#image-pipeline)) instead of a single
  oversized original.
- Hero images are marked `fetchpriority="high"` and preloaded (with
  `imagesrcset` so the preload matches what will actually be downloaded); all
  other images are lazy-loaded.
- Fonts load via `<link rel="preload">` with a `font-display: swap` Google
  Fonts stylesheet, rather than a render-blocking CSS `@import`.
- All images ship `width`/`height` attributes so the browser can reserve
  layout space before they load, avoiding layout shift.
- No JavaScript framework or third-party scripts beyond Google Fonts, the
  Google Maps embed, and (once configured) the Formspree form endpoint.

### Troubleshooting

**Images don't show up after deploying, but work fine locally.**
Render (like most Linux hosts) has a case-sensitive filesystem; Windows and
macOS are usually not. Double-check that the `src`/`srcset` path in the HTML
matches the actual filename's capitalization exactly.

**Fonts flash unstyled or don't load.**
Usually a network/ad-blocker issue with `fonts.googleapis.com`, or the
`<link rel="preload">` in the page's `<head>` was edited/removed. Compare
against another page's `<head>` for the correct font-loading block.

**The map doesn't appear.**
The Google Maps embed is a third-party iframe; if Google changes/rate-limits
embed URLs this can break independently of anything in this codebase. The
"Open map in Google Maps" link next to it is a working fallback either way.

**The reservation form doesn't seem to send anything.**
See [Contact form](#contact-form) — it needs a real Formspree endpoint
configured before it will deliver submissions anywhere.

**Mobile menu button doesn't open the nav.**
Check that `main.js` is loading (browser DevTools → Network tab). It's
loaded with `defer` at the end of `<body>`, so it should load on every page
that includes `<script src="main.js" defer></script>`.

---

## Before you launch — placeholders to replace

A few values are intentionally placeholders because the real values weren't
available at build time. Search the codebase for each and replace before
going live:

| Placeholder | Where | Replace with |
|---|---|---|
| `www.yellowcaptain.example` | `<head>` of every page, `sitemap.xml`, `robots.txt` | The real domain, once purchased/connected |
| `https://formspree.io/f/YOUR_FORM_ID` | `contact.html` | A real Formspree endpoint — see [Contact form](#contact-form) |
| `https://wa.me/1234567890` | Footer (every page), `contact.html` | The restaurant's real WhatsApp Business number |
| `facebook.com/yellowcaptain`, `instagram.com/yellowcaptain`, `linkedin.com/company/yellow-captain` | Footer (every page) | The real social profile URLs (or remove any that don't apply — a LinkedIn page is unusual for a casual restaurant) |
| Menu items, prices, and hours | `index.html`, `menu.html`, `specials.html`, `contact.html` | Confirmed current pricing and hours from the client |

Everything else — phone number, address, and map — already reflects the real
Vision City Mega Mall location as supplied.
