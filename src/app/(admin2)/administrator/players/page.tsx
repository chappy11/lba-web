import { getAllPlayers } from "@/_lib/server/player";
import Header from "@/components/header";
import PlayerList from "@/feature/players/PlayerList";

export default async function Page() {
	const resp = await getAllPlayers();
	console.log(resp);
	return (
		<div className=" mx-auto w-[69%]">
			<Header title={"Players"} />
			<PlayerList players={resp} />
		</div>
	);
}
