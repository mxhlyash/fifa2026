# FIFA 2026 — Fan Hub (TheSportsDB-only)

This repo is now configured to use TheSportsDB v1 as the single upstream provider. TheSportsDB allows using the free demo key `123` by embedding it in the v1 base path — so you do not need to register for an API key to try the app.

Base URLs
- v1 Base URL: https://www.thesportsdb.com/api/v1/json
- v2 Base URL: https://www.thesportsdb.com/api/v2/json

Using the free v1 key
- The free key for v1 is `123`. Example calls used by the project:
  - https://www.thesportsdb.com/api/v1/json/123/eventsday.php?d=2026-06-15
  - https://www.thesportsdb.com/api/v1/json/123/lookupteam.php?id=133602
  - https://www.thesportsdb.com/api/v1/json/123/lookupplayer.php?id=34145937

What I changed
- All serverless API routes now use TheSportsDB v1 with the free key `123` by default, so you can run and test the app without setting environment variables.
- If you prefer to use your own TheSportsDB key (recommended for production or higher limits), set THE_SPORTS_DB_KEY in your environment and the routes will use that instead.
- Removed dependency on API-Football; the app now normalizes responses from TheSportsDB into the frontend shape.

How to run locally
1. Install dependencies
   npm install

2. Optional .env.local (only if you have your own key)
   THE_SPORTS_DB_KEY=your_thesportsdb_key_here

3. Run dev server
   npm run dev

4. Example calls
   - http://localhost:3000/api/scores
   - http://localhost:3000/api/scores?date=2026-06-15
   - http://localhost:3000/api/teams/133602
   - http://localhost:3000/api/players/34145937

Notes & next steps
- The free demo key `123` is intended for development/testing and has community-level limits. For a production site or frequent polling, register for your own key and set THE_SPORTS_DB_KEY.
- Consider adding caching (Redis/Edge) if you plan to poll frequently to avoid hitting rate limits.

License: MIT
