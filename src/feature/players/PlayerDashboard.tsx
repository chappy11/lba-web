import { PlayerWithTeam } from "@/_lib/dto/Player.model"
import PlayerCard from "@/components/player-card"

type Props = {
  playerList: PlayerWithTeam[]
}

export default async function PlayerDashboard(props: Props) {
  const { playerList } = props
  
  if (playerList.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-md">
        <p className="text-gray-500 text-lg">No players found</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {playerList.map((val: PlayerWithTeam, index: number) => (
        <PlayerCard 
          player={val as PlayerWithTeam} 
          key={val.id || index.toString()} 
          team={undefined} 
        />
      ))}
    </div>
  )
}
