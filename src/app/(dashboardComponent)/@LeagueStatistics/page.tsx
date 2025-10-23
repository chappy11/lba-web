import { getTeamStatistics } from "@/_lib/server/matchSchedule"
import { Trophy, TrendingUp, TrendingDown, Target, Users } from "lucide-react"
import Image from "next/image"

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

export default async function LeagueStatistics() {
  try {
    const stats = await getTeamStatistics()

    if (!stats || !stats.success || !stats.statistics || stats.statistics.length === 0) {
      return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Statistics Available
          </h3>
          <p className="text-gray-500">
            Statistics will appear once matches have been played
          </p>
        </div>
      )
    }

    const { statistics, totalGames, totalTeams } = stats

    // Get top 3 teams (winners)
    const topTeams = statistics.slice(0, 3)
    
    // Get bottom 3 teams (losers)
    const bottomTeams = statistics.slice(-3).reverse()

    // Calculate total players (mock for now - you can add actual player count if available)
    const totalPlayers = totalTeams * 12 // Assuming average 12 players per team

    return (
      <div className="space-y-6">
        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Games */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-white/80" />
              <div className="text-right">
                <p className="text-3xl font-bold">{totalGames}</p>
                <p className="text-sm text-blue-100">Total Games</p>
              </div>
            </div>
          </div>

          {/* Total Teams */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-white/80" />
              <div className="text-right">
                <p className="text-3xl font-bold">{totalTeams}</p>
                <p className="text-sm text-purple-100">Active Teams</p>
              </div>
            </div>
          </div>

          {/* Total Players */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-white/80" />
              <div className="text-right">
                <p className="text-3xl font-bold">{totalPlayers}</p>
                <p className="text-sm text-green-100">Total Players</p>
              </div>
            </div>
          </div>

          {/* Total Wins (from all teams) */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-white/80" />
              <div className="text-right">
                <p className="text-3xl font-bold">{stats.totalWins}</p>
                <p className="text-sm text-orange-100">Total Wins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Teams (Winners) */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Top Performing Teams
              </h2>
            </div>
            <p className="text-white/90 text-sm mt-1">
              Leading teams in the current season
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topTeams.map((team: TeamStatistic, index: number) => (
                <div
                  key={team.teamId}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Rank Badge */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg ${
                      index === 0
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                        : index === 1
                        ? "bg-gradient-to-br from-gray-300 to-gray-500"
                        : "bg-gradient-to-br from-orange-400 to-orange-600"
                    }`}
                  >
                    #{index + 1}
                  </div>

                  {/* Team Logo */}
                  {team.teamLogo && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-md">
                      <Image
                        src={team.teamLogo}
                        alt={team.teamName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Team Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {team.teamName}
                    </h3>
                    <div className="flex gap-4 mt-1 text-sm">
                      <span className="text-green-600 font-semibold">
                        {team.wins}W
                      </span>
                      <span className="text-red-600 font-semibold">
                        {team.losses}L
                      </span>
                      <span className="text-gray-600">
                        {team.games} Games
                      </span>
                    </div>
                  </div>

                  {/* Win Rate */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {team.winRate.toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-500">Win Rate</p>
                  </div>

                  {/* Goal Difference */}
                  <div className="text-right bg-blue-50 px-4 py-2 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">
                      {team.goalDifference > 0 ? "+" : ""}
                      {team.goalDifference}
                    </p>
                    <p className="text-xs text-gray-500">Goal Diff</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Teams (Losers) */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Teams Needing Improvement
              </h2>
            </div>
            <p className="text-white/90 text-sm mt-1">
              Teams at the bottom of the standings
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {bottomTeams.map((team: TeamStatistic, index: number) => {
                const actualRank = statistics.length - index
                return (
                  <div
                    key={team.teamId}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Rank Badge */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg">
                      #{actualRank}
                    </div>

                    {/* Team Logo */}
                    {team.teamLogo && (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-md">
                        <Image
                          src={team.teamLogo}
                          alt={team.teamName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Team Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {team.teamName}
                      </h3>
                      <div className="flex gap-4 mt-1 text-sm">
                        <span className="text-green-600 font-semibold">
                          {team.wins}W
                        </span>
                        <span className="text-red-600 font-semibold">
                          {team.losses}L
                        </span>
                        <span className="text-gray-600">
                          {team.games} Games
                        </span>
                      </div>
                    </div>

                    {/* Win Rate */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-600">
                        {team.winRate.toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-500">Win Rate</p>
                    </div>

                    {/* Goal Difference */}
                    <div className="text-right bg-red-50 px-4 py-2 rounded-lg">
                      <p className="text-lg font-bold text-red-600">
                        {team.goalDifference > 0 ? "+" : ""}
                        {team.goalDifference}
                      </p>
                      <p className="text-xs text-gray-500">Goal Diff</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Full Standings Preview */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Complete Standings
                </h2>
              </div>
              <a
                href="/standing"
                className="text-sm text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                View All →
              </a>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Rank
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Team
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      GP
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      W
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      L
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Win %
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      +/-
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.slice(0, 8).map((team: TeamStatistic, index: number) => (
                    <tr
                      key={team.teamId}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {team.teamLogo && (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                              <Image
                                src={team.teamLogo}
                                alt={team.teamName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="font-medium text-gray-900">
                            {team.teamName}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4 text-sm text-gray-700">
                        {team.games}
                      </td>
                      <td className="text-center py-3 px-4 text-sm font-semibold text-green-600">
                        {team.wins}
                      </td>
                      <td className="text-center py-3 px-4 text-sm font-semibold text-red-600">
                        {team.losses}
                      </td>
                      <td className="text-center py-3 px-4 text-sm font-semibold text-blue-600">
                        {team.winRate.toFixed(1)}%
                      </td>
                      <td
                        className={`text-center py-3 px-4 text-sm font-semibold ${
                          team.goalDifference > 0
                            ? "text-green-600"
                            : team.goalDifference < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {team.goalDifference > 0 ? "+" : ""}
                        {team.goalDifference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading statistics:", error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <p className="text-red-600 font-semibold">
          Failed to load statistics
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Please try refreshing the page
        </p>
      </div>
    )
  }
}
