import { useRouter } from 'next/router'
import useSWR from 'swr'
import { fetcher } from '../../utils/fetcher'

export default function PlayerPage() {
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR(id ? `/api/players/${id}` : null, fetcher)

  const player = data?.player

  return (
    <div className="min-h-screen p-6">
      <div className="card">
        {!player && <p>Loading player...</p>}
        {player && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1">
              <img src={player.strThumb || '/player.png'} alt={player.strPlayer} className="w-48 h-48 object-cover rounded-squarish" />
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl font-bold">{player.strPlayer}</h1>
              <p className="opacity-70 mt-2">Position: {player.strPosition}</p>
              <p className="mt-4">{player.strDescriptionEN}</p>
              <div className="mt-4">
                <div className="text-sm opacity-70">Born: {player.dateBorn} • Nationality: {player.strNationality}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
