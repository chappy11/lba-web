import { getAllPlayers } from "@/_lib/server/player"
import PlayerList from "@/feature/players/PlayerList"

export default async function Page() {
  const resp = await getAllPlayers()

  return (
    <div className=" mx-auto w-[80%] mt-10">
      <PlayerList players={resp} />
    </div>
  )
}
