import { getTeamStandingThisSeason } from "@/_lib/server/team";
import NavigationHeader from "@/components/navigation-header";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import TeamStanding from "@/feature/teams/TeamStanding";

export default async function Page() {
	const resp =
		await getTeamStandingThisSeason();

	console.log("Standing Page", resp);

	return (
		<div className=" w-full flex-1 bg-black">
			<NavigationHeader />
			<div className=" mx-auto w-[95%] md:w-[80%] lg:w-[60%]">
				<h1 className=" text-white font-semibold py-5 text-2xl">
					Standing
				</h1>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className=" text-white w-[70%]">
								Name
							</TableHead>
							<TableHead className=" text-white  text-center">
								Wins
							</TableHead>
							<TableHead className=" text-white  text-center">
								Losses
							</TableHead>
							<TableHead className=" text-white  text-center">
								Games
							</TableHead>
							<TableHead className=" text-white  text-center">
								Win Rate
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TeamStanding
							teamStanding={resp}
						/>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
