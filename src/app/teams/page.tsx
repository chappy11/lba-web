import { getCurrentTeamFromThisSeason } from "@/_lib/server/team";
import { THEME } from "@/lib/theme";
import NavigationHeader from "@/components/navigation-header";
import TeamDashboard from "@/feature/teams/TeamsDashboard";

export default async function Page() {
	const teams =
		await getCurrentTeamFromThisSeason();
	return (
    <div className="w-full flex-1 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavigationHeader />
      <div className="w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] mx-auto py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className={`h-12 w-2 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full`} />
            <div>
              <h1 className="text-4xl font-black text-gray-900">
                Teams Participate
              </h1>
              <p className="text-gray-600 mt-1">
                {teams.length} team{teams.length !== 1 ? 's' : ''} competing this season
              </p>
            </div>
          </div>
          <div className={`h-1 w-32 ${THEME.TEAMS.GRADIENT} rounded-full ml-6`} />
        </div>

        {/* Teams Grid */}
        <div className="flex flex-row flex-wrap gap-6">
          <TeamDashboard teamList={teams} />
        </div>
      </div>
    </div>
  )
}
