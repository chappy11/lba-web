import { PlayerWithTeam } from "@/_lib/dto/Player.model"
import PlayerCard from "@/components/player-card"

type Props = {
  playerList: PlayerWithTeam[]
}

export default async function PlayerDashboard(props: Props) {
  const { playerList } = props
  return playerList.map((val: PlayerWithTeam, index: number) => {
    return <PlayerCard player={val as PlayerWithTeam} key={index.toString()} team={undefined} />
  })
}
