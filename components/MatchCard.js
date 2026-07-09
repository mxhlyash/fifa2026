import Link from 'next/link'

export default function MatchCard({ match }) {
  return (
    <article className="card flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <img src={match.homeBadge || '/team-placeholder.png'} alt="home" width={48} height={48} className="rounded-squarish" />
          <div>
            <div className="font-semibold">{match.home}</div>
            <div className="text-sm opacity-70">vs {match.away}</div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="text-xl font-mono">{match.score ?? `${match.homeScore ?? '-'} - ${match.awayScore ?? '-'}`}</div>
        <div className="text-sm opacity-70">{match.status || match.kickoff || 'TBD'}</div>
      </div>

      <div className="text-right">
        <div className="text-sm">Stadium</div>
        <div className="font-semibold">{match.stadium || 'Unknown'}</div>
        <div className="mt-2"><Link href={`/teams/${match.homeId}`} className="text-primary">Team page</Link></div>
      </div>
    </article>
  )
}
