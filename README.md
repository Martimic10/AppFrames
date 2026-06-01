# AppFrames

Create stunning App Store screenshots in minutes. Upload your app screens, customize layouts with device mockups and typography, and export launch-ready assets.

**Live demo:** _Add your Vercel URL here_

---

## Features

### Editor
- Drag-and-drop screenshot editor with multi-slide compositions
- iPhone device mockups with rotation, scaling, and editorial edge cropping
- Upload custom graphics (logos, illustrations) with resize and reposition
- Category templates, gradients, backgrounds, and custom text boxes
- App Store–sized PNG export (single slide or ZIP)

### Plans
| Free | Pro (Lifetime) |
|------|----------------|
| 3 exports | Unlimited exports |
| Basic templates | Premium templates |
| Watermarked exports | No watermark |
| Standard quality | HD exports |

Pro is sold as a **one-time lifetime license** via Stripe Checkout.

---

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Stripe](https://stripe.com/) (Checkout + webhooks)
- [html-to-image](https://github.com/niklasvh/html2canvas/tree/master/packages/html-to-image) + [JSZip](https://stuartk.com/jszip/) for exports

---

## Getting started

### Prerequisites
- Node.js 18+
- npm
- A [Stripe](https://dashboard.stripe.com/register) account (for payments)

### Install & run locally

```bash
git clone https://github.com/Martimic10/AppFrames.git
cd AppFrames
npm install
cp .env.example .env.local
```

Fill in `.env.local` (see below), then:

```bash
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

### Other scripts

```bash
npm run build   # production build
npm run start   # run production server
npm run lint    # ESLint
```

---


## Project structure

```
app/
  page.tsx              # Landing page
  create/               # Screenshot editor
  privacy/              # Privacy policy
  terms/                # Terms of service
  api/stripe/           # Checkout, verify, webhook, restore
  api/pro/              # Pro status
components/
  create/               # Editor UI & export pipeline
  landing/              # Marketing site
  pro/                  # Upgrade modal, checkout, gating
lib/
  pro/                  # License tokens, export limits
  stripe/               # Stripe helpers, lifetime deal stats
public/                 # Logos and marketing assets
```

---

## Contact

Questions or support: **martimicm1010@gmail.com**

---

## License

All rights reserved. This repository is the private product codebase for AppFrames.
