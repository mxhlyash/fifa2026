// pages/api/scores.js
// Normalized fixtures using TheSportsDB v1 endpoints. Uses free key '123' by default (no ENV required).
// Docs: https://www.thesportsdb.com/api.php

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

  // TheSportsDB v1 base with free key '123' by default. You can set THE_SPORTS_DB_KEY env to use your own key.
  const key = process.env.THE_SPORTS_DB_KEY || '123'
  const date = req.query.date || todayISO()
  const url = `https://www.thesportsdb.com/api/v1/json/${key}/eventsday.php?d=${encodeURIComponent(date)}`

  try {
    const r = await fetch(url)
    if (!r.ok) throw new Error(`thesportsdb ${r.status}`)
    const payload = await r.json()
    const matches = (payload?.events || []).slice(0, 50).map((e) => ({
      id: e.idEvent || `${e.dateEvent}_${e.strHomeTeam}`,
      home: e.strHomeTeam,
      away: e.strAwayTeam,
      stadium: e.strVenue || e.strStadium || null,
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
    // Fallback demo data if allowed
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

    return res.status(500).json({ error: 'Failed to fetch from TheSportsDB, and no demo allowed. Try ?demo=true or set ALLOW_DEMO=true.' })
  }
}
