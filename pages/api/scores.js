// pages/api/scores.js
// FIFA-focused scores: query eventsday.php and filter for World Cup / FIFA events, then enrich with team badges via searchteams.php

const CACHE_TTL = 20 * 1000
const cache = global.__fifa_scores_cache || (global.__fifa_scores_cache = { ts: 0, data: null })

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

async function lookupTeamBadge(key, teamName) {
  if (!teamName) return null
  try {
    const url = `https://www.thesportsdb.com/api/v1/json/${key}/searchteams.php?t=${encodeURIComponent(teamName)}`
    const r = await fetch(url)
    if (!r.ok) return null
    const payload = await r.json()
    const team = payload.teams && payload.teams[0]
    if (team) return { badge: team.strTeamBadge, fanart: team.strTeamFanart, stadium: team.strStadium }
  } catch (e) {
    console.warn('team lookup failed', e.message)
  }
  return null
}

export default async function handler(req, res) {
  const forceDemo = req.query.demo === 'true'
  if (Date.now() - cache.ts < CACHE_TTL && cache.data && !forceDemo) {
    return res.status(200).json({ source: cache.source, matches: cache.data })
  }

  const key = process.env.THE_SPORTS_DB_KEY || '123'
  const date = req.query.date || todayISO()
  const url = `https://www.thesportsdb.com/api/v1/json/${key}/eventsday.php?d=${encodeURIComponent(date)}`

  try {
    const r = await fetch(url)
    if (!r.ok) throw new Error(`thesportsdb ${r.status}`)
    const payload = await r.json()
    let events = payload?.events || []

    // Filter to FIFA World Cup-related events (league or event name contains 'World Cup' or 'FIFA')
    events = events.filter(e => {
      const league = (e.strLeague || '').toLowerCase()
      const event = (e.strEvent || '').toLowerCase()
      const season = (e.strSeason || '')
      return league.includes('world cup') || league.includes('fifa') || event.includes('world cup') || event.includes('fifa') || season.includes('2026')
    })

    // Enrich with team badges (searchteams)
    const enriched = []
    for (const e of events.slice(0, 50)) {
      const home = e.strHomeTeam
      const away = e.strAwayTeam
      const homeMeta = await lookupTeamBadge(key, home)
      const awayMeta = await lookupTeamBadge(key, away)
      enriched.push({
        id: e.idEvent || `${e.dateEvent}_${home}`,
        home,
        away,
        homeId: e.idHomeTeam || (homeMeta && homeMeta.idTeam) || null,
        awayId: e.idAwayTeam || (awayMeta && awayMeta.idTeam) || null,
        stadium: e.strVenue || e.strStadium || (homeMeta && homeMeta.stadium) || null,
        stadiumImage: (homeMeta && homeMeta.fanart) || null,
        competition: e.strLeague,
        group: e.strSeason || null,
        kickoff: (e.dateEvent ? `${e.dateEvent}` : '') + (e.strTime ? ` ${e.strTime}` : ''),
        status: e.strStatus || null,
        homeScore: e.intHomeScore ?? null,
        awayScore: e.intAwayScore ?? null,
        homeBadge: homeMeta?.badge || null,
        awayBadge: awayMeta?.badge || null,
      })
    }

    cache.ts = Date.now()
    cache.data = enriched
    cache.source = 'thesportsdb'
    return res.status(200).json({ source: 'thesportsdb', matches: enriched })
  } catch (e) {
    console.warn('TheSportsDB fetch failed:', e.message)
    if (forceDemo || process.env.ALLOW_DEMO === 'true') {
      const demo = [
        { id: 'demo1', home: 'Argentina', away: 'France', homeScore: 2, awayScore: 1, status: 'FT', stadium: 'Solaris Arena', kickoff: '2026-06-15 18:00', homeBadge: '/team-placeholder.png', awayBadge: '/team-placeholder.png' },
      ]
      cache.ts = Date.now()
      cache.data = demo
      cache.source = 'demo'
      return res.status(200).json({ source: 'demo', matches: demo })
    }
    return res.status(500).json({ error: 'Failed to fetch from TheSportsDB. Try ?demo=true or set ALLOW_DEMO=true.' })
  }
}
