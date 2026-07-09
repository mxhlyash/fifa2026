import Link from 'next/link'

export default function MatchCard({ match }) {
  return (
    <article className="card flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center w-28">
          <img src={match.homeBadge || '/team-placeholder.png'} alt={match.home} className="w-16 h-16 object-cover rounded-squarish mb-1" />
          <div className="text-xs opacity-70 text-center">{match.home}</div>
        </div>

        <div className="px-4">
          <div className="text-sm opacity-70">{match.competition || 'FIFA World Cup 2026'}</div>
          <div className="text-xs opacity-60">{match.group || ''}</div>
          <div className="text-sm opacity-70">{match.kickoff}</div>
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-mono">{(match.homeScore != null || match.awayScore != null) ? `${match.homeScore ?? '-'} - ${match.awayScore ?? '-'}` : '-'}</div>
        <div className={`mt-1 inline-block px-2 py-1 text-xs rounded ${match.status === 'LIVE' ? 'bg-accent text-white' : 'bg-[#0b2b33] text-[#a6cfd0]'}`}>{match.status || 'TBD'}</div>
      </div>

      <div className="flex flex-col items-end w-28">
        <img src={match.awayBadge || '/team-placeholder.png'} alt={match.away} className="w-16 h-16 object-cover rounded-squarish mb-1" />
        <div className="text-xs opacity-70 text-center">{match.away}</div>
        <div className="mt-2"><Link href={`/teams/${match.homeId || ''}`} className="text-primary text-xs">Team page</Link></div>
      </div>
    </article>
  )
}
