import { getAllPlayers } from "@/_lib/server/player";
import Header from "@/components/header";
import PlayerList from "@/feature/players/PlayerList";

export default async function Page() {
	const resp = await getAllPlayers();

	return (
    <div className=" mx-auto w-[50%] mt-10">
      <Header title={"Players"} />
      <PlayerList players={resp} />
    </div>
  )
}
