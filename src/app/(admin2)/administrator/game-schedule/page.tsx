import { getGames } from "@/_lib/server/game";
import Header from "@/components/header";
import GameList from "@/feature/game/Gamelist";

export default async function Page() {
	const resp = await getGames();
	console.log(
		"===================================="
	);
	console.log(resp);
	console.log(
		"===================================="
	);
	if (!resp) {
		return (
			<p className=" text-center">
				Loading...
			</p>
		);
	}
	return (
		<div className=" flex flex-1">
			<div className=" w-[60%] mx-auto mt-5">
				<Header
					title="Game Schedule"
					createButtonName="Create"
					link="/administrator/game-schedule/create"
				/>
				<GameList data={resp} />
			</div>
		</div>
	);
}
