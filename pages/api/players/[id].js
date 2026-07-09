// pages/api/players/[id].js
// Uses lookupplayer.php by id or searchplayers.php by name

export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'Player id required' })

  const key = process.env.THE_SPORTS_DB_KEY || '123'
  let url = ''
  if (/^\d+$/.test(String(id))) {
    url = `https://www.thesportsdb.com/api/v1/json/${key}/lookupplayer.php?id=${encodeURIComponent(id)}`
  } else {
    url = `https://www.thesportsdb.com/api/v1/json/${key}/searchplayers.php?p=${encodeURIComponent(id)}`
  }

  try {
    const r = await fetch(url)
    if (!r.ok) throw new Error(`thesportsdb ${r.status}`)
    const payload = await r.json()
    const player = (payload && (payload.player || payload.players) && (payload.player ? payload.player[0] : payload.players[0])) || null
    if (!player) return res.status(404).json({ error: 'Player not found' })
    return res.status(200).json({ source: 'thesportsdb', player })
  } catch (e) {
    console.warn('TheSportsDB player fetch failed', e.message)
    return res.status(500).json({ error: 'Failed to fetch player from TheSportsDB' })
  }
}
