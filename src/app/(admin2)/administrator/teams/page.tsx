import { getCurrentTeamFromThisSeason } from "@/_lib/server/team"
import TeamsList from "@/feature/teams/TeamsList"

export default async function Teams() {
  const teams = await getCurrentTeamFromThisSeason()
  return (
    <div className="w-full flex-1 h-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 max-w-7xl">
        <TeamsList data={teams} />
      </div>
    </div>
  )
}
