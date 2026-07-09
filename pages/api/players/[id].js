// pages/api/players/[id].js
// Returns player info. For API-Football you typically query players by team and season,
// but some APIs also allow direct player lookups. We'll attempt API-Football then TheSportsDB.

export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'Player id required' })

  // API-Football: players endpoint requires team and season in many cases; we try a direct player lookup
  const apiFootballKey = process.env.API_FOOTBALL_KEY || process.env.API_SPORTS_KEY
  if (apiFootballKey) {
    try {
      // Try the player endpoint (some plans support /players?id=)
      const r = await fetch(`https://v3.football.api-sports.io/players?id=${encodeURIComponent(id)}`, { headers: { 'x-apisports-key': apiFootballKey } })
      if (r.ok) {
        const payload = await r.json()
        if (payload.response && payload.response.length > 0) {
          return res.status(200).json({ source: 'api-football', player: payload.response[0].player || payload.response[0] })
        }
      }
    } catch (e) {
      console.warn('API-Football player fetch failed', e.message)
    }
  }

  // TheSportsDB: lookupplayer.php?id=
  const sportsdbKey = process.env.THE_SPORTS_DB_KEY || process.env.NEXT_PUBLIC_SPORTSDB_KEY
  if (sportsdbKey) {
    try {
      const r = await fetch(`https://www.thesportsdb.com/api/v1/json/${sportsdbKey}/lookupplayer.php?id=${encodeURIComponent(id)}`)
      if (!r.ok) throw new Error(`thesportsdb ${r.status}`)
      const payload = await r.json()
      const player = (payload && payload.players && payload.players[0]) || null
      if (!player) return res.status(404).json({ error: 'Player not found' })
      return res.status(200).json({ source: 'thesportsdb', player })
    } catch (e) {
      console.warn('TheSportsDB player fetch failed', e.message)
    }
  }

  return res.status(400).json({ error: 'No upstream API configured. Set API_FOOTBALL_KEY or THE_SPORTS_DB_KEY.' })
}
