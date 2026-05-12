# LaneAI — Frontend

A futuristic, production-ready frontend for a cloud-based AI Lane Line Detection
platform. Built with **Next.js 15** (App Router), **TypeScript**, **TailwindCSS**,
**Framer Motion**, and **Shadcn UI** primitives.

The UI simulates a real-time autonomous-driving perception product: video upload,
live lane detection HUD, road analytics, AI confidence telemetry, fleet
heatmaps, and more — all rendered with dummy/sample data (no backend needed).

---

## Tech stack

| Layer       | Tooling                                             |
|-------------|-----------------------------------------------------|
| Framework   | Next.js 15 (App Router) + React 19                  |
| Language    | TypeScript 5.7                                      |
| Styling     | TailwindCSS 3.4 + custom design tokens              |
| UI Kit      | Shadcn-style primitives (Button / Card / Input / …) |
| Motion      | Framer Motion 11                                    |
| Icons       | Lucide React                                        |
| Fonts       | Inter, Space Grotesk, JetBrains Mono (via next/font)|

---

## Folder structure

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout · fonts · global effects
│   ├── page.tsx             # Marketing + product home
│   └── globals.css          # Tailwind + custom CSS layers
├── components/
│   ├── ui/                  # Shadcn primitives (button, card, …)
│   ├── navbar.tsx
│   ├── hero-section.tsx
│   ├── hero-visual.tsx
│   ├── live-demo-section.tsx
│   ├── features-section.tsx
│   ├── how-it-works-section.tsx
│   ├── analytics-section.tsx
│   ├── technologies-section.tsx
│   ├── testimonials-section.tsx
│   ├── contact-section.tsx
│   ├── footer.tsx
│   ├── cursor-glow.tsx
│   ├── particles-background.tsx
│   ├── grid-background.tsx
│   ├── scroll-progress.tsx
│   └── loading-screen.tsx
├── lib/
│   └── utils.ts             # `cn()` + helpers
├── public/
│   └── favicon.svg
├── components.json          # Shadcn config
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## Installation

```bash
# From the project root
cd frontend

# Install dependencies (choose one)
npm install
# or
pnpm install
# or
yarn
```

> Requires **Node 18.18+** (Node 20 recommended).

---

## Development

```bash
npm run dev
```

Opens on http://localhost:3000.

The Loading Screen runs once on first paint, then the page reveals the
hero, live demo dashboard, features, pipeline timeline, analytics deck,
tech stack, testimonials, contact form, and footer.

---

## Production build

```bash
npm run build
npm run start
```

`next start` serves the optimized build on port 3000.

---

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel
# follow the prompts — Vercel auto-detects Next.js 15
```

### Docker (single-stage example)

```Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### Static hosting

Next.js 15 server components are required for fonts/metadata — deploy to any
host that supports the Next.js runtime (Vercel, Netlify, AWS Amplify,
Cloudflare Pages with adapter, self-hosted Node).

---

## Customization

- **Brand colors** — tweak `--background`, `--primary`, `--accent`, neon tokens in `app/globals.css` and `tailwind.config.ts`.
- **Section copy** — sections live one file each under `components/*-section.tsx`.
- **Sample data** — feature lists, testimonials, dashboard metrics are co-located with their component.
- **Animations** — global keyframes live in `tailwind.config.ts`; section-level reveals use Framer Motion `whileInView`.

---

## Accessibility & responsiveness

- Dark theme with prefers-reduced-motion guard on the cursor glow.
- Sticky transparent navbar collapses into a glass mobile menu.
- All sections respond at `sm` / `lg` breakpoints.
- Semantic landmarks (`<header>`, `<main>`, `<section>`, `<footer>`).
- Focus-visible rings on every interactive surface.

---

## SEO

`app/layout.tsx` defines `metadata` (OpenGraph + Twitter) and a `viewport`
theme color. Update `siteUrl` / `siteName` in that file before deploying.

---

## License

Demo project for portfolio / showcase purposes.
