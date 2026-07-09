# FIFA 2026 — Fan Hub

This repository has been redeveloped to focus exclusively on the FIFA World Cup 2026 tournament. The UI, pages and serverless endpoints are tailored to surface World Cup matches, teams and players.

Data sources
- Primary data: TheSportsDB v1 (free key `123` by default). Endpoints used include eventsday.php, searchteams.php, lookupteam.php and lookupplayer.php.
- Images: team badges and fanart are fetched from TheSportsDB when possible. Wikimedia images may be used as supplemental sources in future updates.

What’s included
- Next.js + Tailwind UI with a dark, neon-accent, squarish aesthetic.
- Hero banner, featured match card, improved MatchCard with team badges and stadium images.
- Serverless API routes that filter TheSportsDB events to only show FIFA/World Cup-related matches (by league/event name or season 2026):
  - GET /api/scores (filtered/enriched)
  - GET /api/teams/[id]
  - GET /api/players/[id]
- Team and Player pages with full details and images when available.

How to run locally
1. npm install
2. npm run dev
3. Visit http://localhost:3000

Notes & next steps
- TheSportsDB demo key (123) is used by default so you can test without registering. For production, register and set THE_SPORTS_DB_KEY to your own key.
- I will next: implement a curated official schedule ingestion (from public sources) if TheSportsDB does not yet have full World Cup 2026 fixtures, improve image fallbacks (Wikimedia), and add animations for match timeline and player cards.

License: MIT
