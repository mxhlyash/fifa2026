# FIFA 2026 — Fan Hub

This repository is a starter Vercel-friendly Next.js project for a FIFA 2026 fan site with a squarish design, animations, and mock live data.

Features included:
- Next.js + Tailwind CSS scaffold
- Mock server API endpoints under /pages/api so the site works out-of-the-box
- Animated player card using Framer Motion
- Match list cards, tournament table UI
- Simple proxy to TheSportsDB if you set NEXT_PUBLIC_SPORTSDB_KEY
- Vercel deployment notes

Getting started

1. Install:

   npm install

2. Run locally:

   npm run dev

3. To enable live data proxy (optional):

   - Sign up for a free key at TheSportsDB (or any other free sports API).
   - Add the key in Vercel or a local .env file as NEXT_PUBLIC_SPORTSDB_KEY.
   - The serverless /api/scores will attempt to proxy live events for today's date and fall back to demo data.

Deploying to Vercel

- Import this repo into Vercel and set environment variables if you want real data.
- The project is configured to build with Next.js out-of-the-box.

Extending the project

- Add pages/teams/[id].js to show team and player details by calling /api/teams or directly integrating a chosen API.
- Add WebSocket polling or server-sent events for truly live updates.
- Replace mock data with real providers (TheSportsDB, ScoreBat, or API-Football).

License: MIT
