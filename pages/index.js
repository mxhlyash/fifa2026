import Link from 'next/link'
import useSWR from 'swr'
import { fetcher } from '../utils/fetcher'
import MatchCard from '../components/MatchCard'
import AnimatedPlayer from '../components/AnimatedPlayer'

export default function Home() {
  const { data: scores, error } = useSWR('/api/scores', fetcher, { refreshInterval: 10000 })

  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl logo-slab">FIFA 2026 — Fan Hub</h1>
        <nav className="space-x-4">
          <Link href="/">Home</Link>
          <Link href="/teams">Teams</Link>
        </nav>
      </header>

      <main className="grid grid-cols-12 gap-6">
        <section className="col-span-8">
          <div className="card mb-6">
            <h2 className="text-xl mb-3">Live & Latest Matches</h2>
            {!scores && <p>Loading...</p>}
            {scores && scores.matches.length === 0 && <p>No matches found for today — all demo data shown.</p>}
            <div className="space-y-3">
              {scores?.matches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl mb-3">Tournament Table (Demo)</h2>
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left opacity-80">
                  <th>Team</th>
                  <th>Pts</th>
                  <th>P</th>
                </tr>
              </thead>
              <tbody>
                {[{team:'Team A',pts:9,p:3},{team:'Team B',pts:6,p:3},{team:'Team C',pts:3,p:3},{team:'Team D',pts:0,p:3}].map((r)=> (
                  <tr key={r.team} className="border-t border-[#0f2b33]">
                    <td className="py-2">{r.team}</td>
                    <td>{r.pts}</td>
                    <td>{r.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="col-span-4 space-y-6">
          <div className="card">
            <h3 className="text-lg mb-3">Match Finder</h3>
            <form className="space-y-3">
              <input className="w-full bg-transparent border border-[#11303a] p-2 rounded-squarish" placeholder="Search team or stadium"/>
              <div className="flex gap-2">
                <input type="date" className="bg-transparent border border-[#11303a] p-2 rounded-squarish" />
                <button className="px-3 py-2 bg-primary rounded-squarish">Search</button>
              </div>
            </form>
          </div>

          <div className="card">
            <h3 className="text-lg mb-3">Featured Player</h3>
            <AnimatedPlayer name="Alex Pulse" role="Forward" img="/player.png"/>
          </div>

          <div className="card">
            <h3 className="text-lg mb-3">Deploy</h3>
            <p className="text-sm">This project is Vercel-ready. Add env vars in Vercel: NEXT_PUBLIC_SPORTSDB_KEY (optional) to proxy live APIs.</p>
          </div>
        </aside>
      </main>

      <footer className="mt-10 text-sm opacity-75">Made with ❤️ — Squarish UI and animations. Data comes from demo API; set up free sports API keys to enable live data.</footer>
    </div>
  )
}
