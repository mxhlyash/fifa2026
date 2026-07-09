import useSWR from 'swr'
import { fetcher } from '../utils/fetcher'
import MatchCard from '../components/MatchCard'
import Hero from '../components/Hero'
import { motion } from 'framer-motion'

export default function Home() {
  // Fetch FIFA-focused matches
  const { data: scores, error } = useSWR('/api/scores', fetcher, { refreshInterval: 15000 })

  const matches = scores?.matches || []
  const featured = matches[0]

  return (
    <div className="min-h-screen p-6">
      <Hero />

      <main className="grid grid-cols-12 gap-6 mt-6">
        <section className="col-span-8">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card mb-6">
            <h2 className="text-xl mb-3">Live & FIFA 2026 Matches</h2>
            {!scores && <p>Loading FIFA matches...</p>}
            {scores && matches.length === 0 && (
              <div className="p-6 bg-[#071725] rounded-squarish">
                <p className="mb-2">No FIFA World Cup 2026 matches found for the selected date range.</p>
                <p className="text-sm opacity-70">TheSportsDB may not have full tournament data yet — try different dates or add THE_SPORTS_DB_KEY for more coverage.</p>
              </div>
            )}

            <div className="space-y-3 mt-3">
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </motion.div>

          <div className="card">
            <h2 className="text-xl mb-3">Tournament Table</h2>
            <p className="text-sm opacity-70 mb-3">Standings are computed from available FIFA match results.</p>
            {/* Simple computed table (grouped by group if available) */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left opacity-80">
                    <th>Team</th>
                    <th>Pts</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Placeholder: we'll compute table when group data exists */}
                  <tr className="border-t border-[#0f2b33]"><td colSpan={6} className="py-4 opacity-70">Group standings will appear here when FIFA match results are available.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="col-span-4 space-y-6">
          {featured && (
            <div className="card">
              <h3 className="text-lg mb-3">Featured Match</h3>
              <div className="rounded-squarish overflow-hidden">
                <img src={featured.stadiumImage || featured.homeBadge || '/team-placeholder.png'} alt="featured" className="w-full h-40 object-cover" />
                <div className="p-3">
                  <div className="font-semibold">{featured.home} vs {featured.away}</div>
                  <div className="text-sm opacity-70">{featured.kickoff} • {featured.stadium || 'Unknown stadium'}</div>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="text-lg mb-3">Match Finder</h3>
            <form className="space-y-3">
              <input id="search" className="w-full bg-transparent border border-[#11303a] p-2 rounded-squarish" placeholder="Search team or stadium"/>
              <div className="flex gap-2">
                <input id="date" type="date" className="bg-transparent border border-[#11303a] p-2 rounded-squarish" />
                <button type="button" onClick={() => { const s = document.getElementById('search').value; const d = document.getElementById('date').value; window.location.href = `/search?q=${encodeURIComponent(s)}&d=${encodeURIComponent(d)}` }} className="px-3 py-2 bg-primary rounded-squarish">Search</button>
              </div>
            </form>
          </div>

          <div className="card">
            <h3 className="text-lg mb-3">Featured Player</h3>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-gradient-to-br from-[#062b2e] to-[#0a3a3d] rounded-squarish flex items-center justify-center">
                <img src={'/player.png'} alt={'Featured'} className="w-16 h-16 object-cover rounded-squarish"/>
              </div>
              <div>
                <div className="font-semibold">Alex Pulse</div>
                <div className="text-sm opacity-70">Forward — USA (Demo)</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg mb-3">Deploy</h3>
            <p className="text-sm">This project is Vercel-ready. Add env var THE_SPORTS_DB_KEY if you obtain your own key to increase rate limits.</p>
          </div>
        </aside>
      </main>

      <footer className="mt-10 text-sm opacity-75">Made with ❤️ — FIFA 2026 Fan Hub. Data from TheSportsDB. Images may be supplemented from Wikimedia where available.</footer>
    </div>
  )
}
