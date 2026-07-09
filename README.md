# FIFA 2026 — Fan Hub

This repository is a Next.js + Tailwind starter for a FIFA 2026 fan site. The scaffold includes UI, animations, and serverless API routes that integrate with free sports data providers.

Important: to power live scores, fixtures, stadiums, teams and player pages you must configure one (or more) upstream data providers. This project supports the following providers (in order of preference):

1) API-Football (API-SPORTS)
   - Best coverage and rich data (fixtures, lineups, events, players, venues)
   - Free tier available (register at https://www.api-football.com/ or via RapidAPI)
   - Env var: API_FOOTBALL_KEY (or API_SPORTS_KEY)
   - Header used: x-apisports-key
   - Example: the app's /api/scores will call `https://v3.football.api-sports.io/fixtures?date=YYYY-MM-DD`

2) TheSportsDB
   - Free, community API with team/player/stadium data and event-day lookup
   - Register for a free API key at https://www.thesportsdb.com
   - Env var: THE_SPORTS_DB_KEY or NEXT_PUBLIC_SPORTSDB_KEY
   - Example: `/pages/api/scores` uses `eventsday.php?d=YYYY-MM-DD` when this key is set

Fallback behavior
- If neither provider is configured, the server endpoints will return a helpful error explaining which env vars to set.
- For testing you can add `?demo=true` to /api/scores to get local demo data (not intended for production).

Server endpoints included
- GET /api/scores?date=YYYY-MM-DD -> list of normalized matches (requires API config)
- GET /api/teams/[id] -> team details (API-Football or TheSportsDB)
- GET /api/players/[id] -> player details (API-Football or TheSportsDB)

How to run locally
1. Install dependencies
   npm install

2. Add env vars (example .env.local)
   API_FOOTBALL_KEY=your_api_football_key_here
   THE_SPORTS_DB_KEY=your_thesportsdb_key_here
   # Optional: ALLOW_DEMO=true to allow demo fallback without query param

3. Run dev server
   npm run dev

4. Example calls
   - http://localhost:3000/api/scores
   - http://localhost:3000/api/scores?date=2026-06-15
   - http://localhost:3000/api/teams/33
   - http://localhost:3000/api/players/276

Notes & next steps
- This project focuses on server-side proxying to keep API keys secret and to normalize multiple provider responses into a single frontend shape.
- To improve rate limits, add a more persistent caching layer (Redis or Vercel Edge Cache) instead of the in-memory cache in this starter.
- Replace demo UI content with richer animated player and team pages (examples in /components).

License: MIT
