import { getAllPlayers } from "@/_lib/server/player";
import NavigationHeader from "@/components/navigation-header";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import PlayerDashboard from "@/feature/players/PlayerDashboard";

export default async function PlayersPage() {
	const resp = await getAllPlayers();
	console.log(resp);
	return (
		<div className=" w-full">
			<NavigationHeader />
			<div className=" mx-auto w-[70%]">
				<h1 className=" text-white font-semibold py-5 text-2xl">
					Players
				</h1>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className=" text-white "></TableHead>
							<TableHead className=" text-white  text-left">
								Name
							</TableHead>
							<TableHead className=" text-white  text-center">
								Position
							</TableHead>
							<TableHead className=" text-white  text-center">
								Age
							</TableHead>
							<TableHead className=" text-white  text-center">
								Team
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{/* <TeamStanding
						teamStanding={resp}
					/> */}
						<PlayerDashboard
							playerList={resp}
						/>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
