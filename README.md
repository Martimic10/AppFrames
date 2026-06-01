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

## Environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Yes | Public site URL (e.g. `http://127.0.0.1:3000` locally, your domain on Vercel) |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (`sk_test_...` or `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Yes | Webhook signing secret from Stripe |
| `PRO_LICENSE_SECRET` | Recommended | Random string used to sign Pro license cookies |
| `STRIPE_PRICE_ID` | Optional | Fixed Stripe Price ID; omit to use dynamic $29 checkout |

Generate a license secret:

```bash
openssl rand -base64 32
```

> **Never commit `.env.local`** — it is gitignored.

---

## Stripe setup

1. Create API keys at [Stripe Dashboard → API keys](https://dashboard.stripe.com/apikeys).
2. Add a webhook endpoint:
   - **URL:** `https://YOUR_DOMAIN/api/stripe/webhook`
   - **Event:** `checkout.session.completed`
3. Copy the webhook **signing secret** into `STRIPE_WEBHOOK_SECRET`.
4. Use **test keys** while developing; switch to **live keys** for production.

After a successful purchase, users are redirected to `/create?checkout=success` and Pro access is unlocked via a signed cookie.

---

## Deploy on Vercel

1. Import this repo at [vercel.com/new](https://vercel.com/new).
2. Add all environment variables under **Project → Settings → Environment Variables**.
3. Set `NEXT_PUBLIC_APP_URL` to your production domain.
4. Deploy, then update your Stripe webhook URL to match the live domain.
5. Redeploy after adding or changing env vars.

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
