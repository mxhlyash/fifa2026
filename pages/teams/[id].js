import { useRouter } from 'next/router'
import useSWR from 'swr'
import { fetcher } from '../../utils/fetcher'

export default function TeamPage() {
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR(id ? `/api/teams/${id}` : null, fetcher)

  const team = data?.team

  return (
    <div className="min-h-screen p-6">
      <div className="card">
        {!team && <p>Loading team...</p>}
        {team && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1">
              <img src={team.strTeamBadge || '/team-placeholder.png'} alt={team.strTeam} className="w-48 h-48 object-contain" />
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold">{team.strTeam}</h1>
              <p className="opacity-70 mt-2">Stadium: {team.strStadium}</p>
              <p className="mt-4">{team.strDescriptionEN}</p>
              <div className="mt-4">
                <a href={team.strWebsite} className="text-primary">Official website</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
