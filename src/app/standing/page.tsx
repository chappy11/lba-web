import { TeamsStanding } from "@/_lib/dto/Team.model"
import { getTeamStatistics } from "@/_lib/server/matchSchedule"
import NavigationHeader from "@/components/navigation-header"
import ArrangeWinnersButton from "@/feature/teams/ArrangeWinnersButton"
import TeamStanding from "@/feature/teams/TeamStanding"
import { THEME } from "@/lib/theme"
import { Award, TrendingUp, Trophy } from "lucide-react"

interface TeamStatistic {
  teamId: string
  teamName: string
  teamLogo: string
  wins: number
  losses: number
  games: number
  goalsFor: number
  goalsAgainst: number
  winRate: number
  goalDifference: number
}

export default async function Page() {
  const statsResponse = await getTeamStatistics()

  if (!statsResponse.success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <NavigationHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-red-600 text-lg">
              Failed to load team statistics
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Transform statistics data to match TeamsStanding interface
  const sortedStandings: TeamsStanding[] = statsResponse.data.statistics.map(
    (stat: TeamStatistic) => ({
      id: stat.teamId,
      teamName: stat.teamName,
      teamLogo: stat.teamLogo,
      win: stat.wins,
      lose: stat.losses,
      games: stat.games,
      // Add other required fields
      teamType: "BASKETBALL",
      dateCreate: "",
      isActive: "",
      seasonId: "",
      coachInfo: { firstname: "", lastname: "", middlename: "" },
      updatedAt: { seconds: 0, nanoseconds: 0 },
    })
  )

  const { totalTeams, totalGames, totalWins, totalLosses } = statsResponse.data

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <NavigationHeader />

      {/* Hero Header */}
      <div className="relative bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className={`${THEME.INFO.GRADIENT} p-4 rounded-xl shadow-lg`}>
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Team Standings
              </h1>
              <p className="text-gray-600 mt-1">
                Current season rankings and statistics
              </p>
            </div>
          </div>
          <div className={`h-1 w-32 ${THEME.INFO.GRADIENT} rounded-full`} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Arrange Winners Button */}
        <div className="mb-8 flex justify-end">
          <ArrangeWinnersButton />
        </div>

        {/* Top 3 Teams Podium */}
        {sortedStandings.length >= 3 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 2nd Place */}
            <div className="md:order-1 order-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-300 hover:shadow-xl transition-all">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-gray-400 to-gray-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-500 mb-2">2nd</p>
                  <p className="font-bold text-lg text-gray-900 mb-1">
                    {sortedStandings[1].teamName}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    {sortedStandings[1].win}W - {sortedStandings[1].lose}L
                  </p>
                  <p className="text-xs text-gray-500">
                    Goal Diff:{" "}
                    {statsResponse.data.statistics[1].goalDifference > 0
                      ? "+"
                      : ""}
                    {statsResponse.data.statistics[1].goalDifference}
                  </p>
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="md:order-2 order-1">
              <div
                className={`${THEME.WARNING.GRADIENT} rounded-2xl shadow-xl p-6 border-4 border-yellow-400 transform md:scale-110 hover:shadow-2xl transition-all`}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
                    <Trophy className="w-10 h-10 text-yellow-500" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-white mb-2">1st</p>
                  <p className="font-bold text-xl text-white mb-1">
                    {sortedStandings[0].teamName}
                  </p>
                  <p className="text-sm text-white/90 mb-1">
                    {sortedStandings[0].win}W - {sortedStandings[0].lose}L
                  </p>
                  <p className="text-xs text-white/80">
                    Goal Diff:{" "}
                    {statsResponse.data.statistics[0].goalDifference > 0
                      ? "+"
                      : ""}
                    {statsResponse.data.statistics[0].goalDifference}
                  </p>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="md:order-3 order-3">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-300 hover:shadow-xl transition-all">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-orange-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-500 mb-2">3rd</p>
                  <p className="font-bold text-lg text-gray-900 mb-1">
                    {sortedStandings[2].teamName}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    {sortedStandings[2].win}W - {sortedStandings[2].lose}L
                  </p>
                  <p className="text-xs text-gray-500">
                    Goal Diff:{" "}
                    {statsResponse.data.statistics[2].goalDifference > 0
                      ? "+"
                      : ""}
                    {statsResponse.data.statistics[2].goalDifference}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Standings Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className={`${THEME.INFO.GRADIENT} px-6 py-4`}>
            <h2 className="text-2xl font-bold text-white">Full Standings</h2>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                    W
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                    L
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                    GP
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                    GD
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Win %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <TeamStanding
                  teamStanding={sortedStandings}
                  statistics={statsResponse.data.statistics}
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div
            className={`${THEME.SUCCESS.GRADIENT} rounded-xl shadow-lg p-6 text-white`}
          >
            <h3 className="text-sm font-semibold uppercase mb-2">
              Total Teams
            </h3>
            <p className="text-4xl font-bold">{totalTeams}</p>
          </div>
          <div
            className={`${THEME.PLAYER.GRADIENT} rounded-xl shadow-lg p-6 text-white`}
          >
            <h3 className="text-sm font-semibold uppercase mb-2">
              Total Games
            </h3>
            <p className="text-4xl font-bold">{totalGames}</p>
          </div>
          <div
            className={`${THEME.SUCCESS.GRADIENT} rounded-xl shadow-lg p-6 text-white border-2 border-white/30`}
          >
            <h3 className="text-sm font-semibold uppercase mb-2">Total Wins</h3>
            <p className="text-4xl font-bold">{totalWins}</p>
          </div>
          <div
            className={`${THEME.PLAYER.GRADIENT} rounded-xl shadow-lg p-6 text-white border-2 border-white/30`}
          >
            <h3 className="text-sm font-semibold uppercase mb-2">
              Total Losses
            </h3>
            <p className="text-4xl font-bold">{totalLosses}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
