// pages/api/players/[id].js
// Returns player details from TheSportsDB v1 using free key '123' by default.

export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'Player id required' })

  const key = process.env.THE_SPORTS_DB_KEY || '123'
  const url = `https://www.thesportsdb.com/api/v1/json/${key}/lookupplayer.php?id=${encodeURIComponent(id)}`

  try {
    const r = await fetch(url)
    if (!r.ok) throw new Error(`thesportsdb ${r.status}`)
    const payload = await r.json()
    const player = (payload.players && payload.players[0]) || null
    if (!player) return res.status(404).json({ error: 'Player not found' })
    return res.status(200).json({ source: 'thesportsdb', player })
  } catch (e) {
    console.warn('TheSportsDB player fetch failed', e.message)
    return res.status(500).json({ error: 'Failed to fetch player from TheSportsDB' })
  }
}
