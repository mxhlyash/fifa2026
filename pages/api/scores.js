// Simple server-side friendly API proxy and mock data for demo purposes
import mock from '../../utils/mockData'

export default async function handler(req, res) {
  // If user configured NEXT_PUBLIC_SPORTSDB_KEY, try to proxy some data
  const key = process.env.NEXT_PUBLIC_SPORTSDB_KEY || process.env.SPORTSDB_KEY
  if (key) {
    try {
      const date = new Date().toISOString().slice(0,10)
      // TheSportsDB has several endpoints; to keep safe we attempt events for a date.
      const url = `https://www.thesportsdb.com/api/v1/json/${key}/eventsday.php?d=${date}`
      const r = await fetch(url)
      if (r.ok) {
        const data = await r.json()
        // Attempt to normalize to our frontend shape
        const matches = (data?.events || []).slice(0,10).map((e, idx) => ({
          id: e.idEvent || idx,
          home: e.strHomeTeam,
          away: e.strAwayTeam,
          stadium: e.strVenue || e.strStadium,
          kickoff: e.dateEvent + ' ' + (e.strTime || ''),
          status: e.strStatus || '',
          homeScore: e.intHomeScore || null,
          awayScore: e.intAwayScore || null,
          homeId: e.idHomeTeam || null,
          awayId: e.idAwayTeam || null,
          homeBadge: null,
        }))
        return res.status(200).json({ source: 'thesportsdb', matches })
      }
    } catch (e) {
      console.warn('API proxy failed', e.message)
    }
  }
  // Fallback: send demo/mock data
  return res.status(200).json({ source: 'mock', matches: mock.matches })
}
