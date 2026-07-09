// pages/api/teams/[id].js
// Returns team details from TheSportsDB v1 using free key '123' by default.

export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'Team id required' })

  const key = process.env.THE_SPORTS_DB_KEY || '123'
  const url = `https://www.thesportsdb.com/api/v1/json/${key}/lookupteam.php?id=${encodeURIComponent(id)}`

  try {
    const r = await fetch(url)
    if (!r.ok) throw new Error(`thesportsdb ${r.status}`)
    const payload = await r.json()
    const team = (payload.teams && payload.teams[0]) || null
    if (!team) return res.status(404).json({ error: 'Team not found' })
    return res.status(200).json({ source: 'thesportsdb', team })
  } catch (e) {
    console.warn('TheSportsDB team fetch failed', e.message)
    return res.status(500).json({ error: 'Failed to fetch team from TheSportsDB' })
  }
}
