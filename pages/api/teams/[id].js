// pages/api/teams/[id].js
// Returns team details and stadium info using configured APIs.

export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'Team id required' })

  // Prefer API-Football
  const apiFootballKey = process.env.API_FOOTBALL_KEY || process.env.API_SPORTS_KEY
  if (apiFootballKey) {
    try {
      const r = await fetch(`https://v3.football.api-sports.io/teams?id=${encodeURIComponent(id)}`, { headers: { 'x-apisports-key': apiFootballKey } })
      if (!r.ok) throw new Error(`api-football ${r.status}`)
      const payload = await r.json()
      const team = (payload.response && payload.response[0] && payload.response[0].team) || null
      if (!team) return res.status(404).json({ error: 'Team not found' })
      return res.status(200).json({ source: 'api-football', team })
    } catch (e) {
      console.warn('API-Football team fetch failed', e.message)
    }
  }

  // Try TheSportsDB
  const sportsdbKey = process.env.THE_SPORTS_DB_KEY || process.env.NEXT_PUBLIC_SPORTSDB_KEY
  if (sportsdbKey) {
    try {
      const r = await fetch(`https://www.thesportsdb.com/api/v1/json/${sportsdbKey}/lookupteam.php?id=${encodeURIComponent(id)}`)
      if (!r.ok) throw new Error(`thesportsdb ${r.status}`)
      const payload = await r.json()
      const team = (payload.teams && payload.teams[0]) || null
      if (!team) return res.status(404).json({ error: 'Team not found' })
      return res.status(200).json({ source: 'thesportsdb', team })
    } catch (e) {
      console.warn('TheSportsDB team fetch failed', e.message)
    }
  }

  return res.status(400).json({ error: 'No upstream API configured. Set API_FOOTBALL_KEY or THE_SPORTS_DB_KEY.' })
}
