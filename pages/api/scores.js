// pages/api/scores.js
// Returns normalized fixtures using API-Football (preferred) or TheSportsDB (fallback)
const CACHE_TTL = 20 * 1000 // 20s for live-ish polling; increase in prod

const cache = global.__fifa_scores_cache || (global.__fifa_scores_cache = { ts: 0, data: null })

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default async function handler(req, res) {
  const forceDemo = req.query.demo === 'true'

  // Serve cached if fresh
  if (Date.now() - cache.ts < CACHE_TTL && cache.data && !forceDemo) {
    return res.status(200).json({ source: cache.source, matches: cache.data })
  }

  // Prefer API-Football (x-apisports-key)
  const apiFootballKey = process.env.API_FOOTBALL_KEY || process.env.API_SPORTS_KEY
  if (apiFootballKey && !forceDemo) {
    try {
      const date = req.query.date || todayISO()
      const url = `https://v3.football.api-sports.io/fixtures?date=${date}`
      const r = await fetch(url, { headers: { 'x-apisports-key': apiFootballKey } })
      if (!r.ok) throw new Error(`api-football ${r.status}`)
      const payload = await r.json()
      const matches = (payload.response || []).slice(0, 50).map((f) => ({
        id: f.fixture?.id,
        home: f.teams?.home?.name,
        away: f.teams?.away?.name,
        homeId: f.teams?.home?.id,
        awayId: f.teams?.away?.id,
        stadium: f.fixture?.venue?.name || null,
        kickoff: f.fixture?.date || null,
        status: f.fixture?.status?.short || f.fixture?.status?.long || null,
        homeScore: f.goals?.home,
        awayScore: f.goals?.away,
        badgeHome: null,
      }))

      cache.ts = Date.now()
      cache.data = matches
      cache.source = 'api-football'
      return res.status(200).json({ source: 'api-football', matches })
    } catch (e) {
      console.warn('API-Football fetch failed:', e.message)
    }
  }

  // Next: TheSportsDB (key in URL)
  const sportsdbKey = process.env.THE_SPORTS_DB_KEY || process.env.NEXT_PUBLIC_SPORTSDB_KEY
  if (sportsdbKey && !forceDemo) {
    try {
      const date = req.query.date || todayISO()
      const url = `https://www.thesportsdb.com/api/v1/json/${sportsdbKey}/eventsday.php?d=${date}`
      const r = await fetch(url)
      if (!r.ok) throw new Error(`thesportsdb ${r.status}`)
      const payload = await r.json()
      const matches = (payload?.events || []).slice(0, 50).map((e) => ({
        id: e.idEvent || `${e.dateEvent}_${e.strHomeTeam}`,
        home: e.strHomeTeam,
        away: e.strAwayTeam,
        stadium: e.strVenue || e.strStadium,
        kickoff: (e.dateEvent ? `${e.dateEvent}` : '') + (e.strTime ? ` ${e.strTime}` : ''),
        status: e.strStatus || null,
        homeScore: e.intHomeScore ?? null,
        awayScore: e.intAwayScore ?? null,
        homeId: e.idHomeTeam || null,
        awayId: e.idAwayTeam || null,
        homeBadge: null,
      }))

      cache.ts = Date.now()
      cache.data = matches
      cache.source = 'thesportsdb'
      return res.status(200).json({ source: 'thesportsdb', matches })
    } catch (e) {
      console.warn('TheSportsDB fetch failed:', e.message)
    }
  }

  // If we reach here and user explicitly asked for demo, return mock
  if (forceDemo || process.env.ALLOW_DEMO === 'true') {
    const demo = [
      { id: 'demo1', home: 'Argenta', away: 'Nord FC', homeScore: 2, awayScore: 1, score: '2 - 1', status: 'FT', stadium: 'Solaris Arena', kickoff: '2026-06-15 18:00', homeId: 't1', awayId: 't2' },
      { id: 'demo2', home: 'Pacifica', away: 'Sierra United', homeScore: null, awayScore: null, score: null, status: 'Upcoming', stadium: 'Mountain Field', kickoff: '2026-06-18 21:00', homeId: 't3', awayId: 't4' },
    ]
    cache.ts = Date.now()
    cache.data = demo
    cache.source = 'demo'
    return res.status(200).json({ source: 'demo', matches: demo })
  }

  // No API configured — return helpful error
  return res.status(400).json({
    error: 'No upstream sports API configured. Set API_FOOTBALL_KEY (API-Football) or THE_SPORTS_DB_KEY (TheSportsDB) as environment variables. For development, call this endpoint with ?demo=true to see demo data.'
  })
}
