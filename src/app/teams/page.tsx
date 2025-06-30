import { getCurrentTeamFromThisSeason } from "@/_lib/server/team";
import NavigationHeader from "@/components/navigation-header";
import TeamDashboard from "@/feature/teams/TeamsDashboard";

export default async function Page() {
	const teams =
		await getCurrentTeamFromThisSeason();
	return (
		<div className=" w-full flex-1 bg-black">
			<NavigationHeader />
			<div className=" w-[95%] md:w-[80%] lg:w-[60%] mx-auto ">
				<h1 className=" text-white font-semibold py-5 text-2xl">
					Teams
				</h1>
				<div className="grid  grid-cols-3 gap-4 py-5">
					<TeamDashboard
						teamList={teams}
					/>
				</div>
			</div>
		</div>
	);
}
