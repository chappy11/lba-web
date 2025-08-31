import { getAllPlayers } from "@/_lib/server/player";
import NavigationHeader from "@/components/navigation-header"
import PlayerDashboard from "@/feature/players/PlayerDashboard";

export default async function PlayersPage() {
	const resp = await getAllPlayers();
	console.log(resp);
	return (
    <div className=" w-full">
      <NavigationHeader />
      <div className=" mx-auto w-[70%]">
        <h1 className=" font-semibold py-5 text-2xl">All Players</h1>
        <div className=" flex flex-row gap-3 flex-wrap">
          <PlayerDashboard playerList={resp} />
        </div>
      </div>
    </div>
  )
}
