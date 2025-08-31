import { getCurrentTeamFromThisSeason } from "@/_lib/server/team";
import NavigationHeader from "@/components/navigation-header";
import TeamDashboard from "@/feature/teams/TeamsDashboard";

export default async function Page() {
	const teams =
		await getCurrentTeamFromThisSeason();
	return (
    <div className=" w-full flex-1 ">
      <NavigationHeader />
      <div className=" w-[95%] md:w-[80%] lg:w-[60%] mx-auto ">
        <h1 className=" text-gray-600 font-semibold py-5 text-2xl">
          Teams Participate
        </h1>
        <div className="flex flex-row flex-wrap gap-5">
          <TeamDashboard teamList={teams} />
        </div>
      </div>
    </div>
  )
}
