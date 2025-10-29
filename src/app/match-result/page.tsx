import { SeasonGames } from "@/_lib/dto/MatchSchedule"
import {
  getEliminationMatchSchedule,
  getMatchResuts,
} from "@/_lib/server/matchSchedule"
import NavigationHeader from "@/components/navigation-header"
import DisplayEliminationMatchSchedule from "@/feature/MatchSchedule/DisplayEliminationMatchSchedule"
import {
  Award,
  BarChart3,
  Calendar,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface MatchResult {
  id: string
  team1: string
  team2: string
  team1Id: string
  team2Id: string
  team1Logo: string
  team2Logo: string
  team1Score: number
  team2Score: number
  gameDate: string
  winner: string
  seasonId: string
  gameId: string
  playerMvp?: string
}

export default async function MatchResultsPage() {
  try {
    const [matchResults, eliminationMatches]: [MatchResult[], SeasonGames[]] =
      await Promise.all([getMatchResuts(), getEliminationMatchSchedule()])

    console.log("Match Results:", matchResults?.length || 0)
    console.log(
      "Elimination Matches:",
      eliminationMatches?.length || 0,
      eliminationMatches
    )

    if (
      (!matchResults || matchResults.length === 0) &&
      (!eliminationMatches || eliminationMatches.length === 0)
    ) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <NavigationHeader />
          <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl shadow-lg">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                      Match Results
                    </h1>
                    <p className="text-gray-600 text-lg mt-1">
                      Detailed analysis and statistics of all completed matches
                    </p>
                  </div>
                </div>
                <div className="h-1 w-32 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" />
              </div>

              {/* No Results State */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <BarChart3 className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  No Match Results Available
                </h3>
                <p className="text-gray-500 text-lg">
                  Match results and analysis will appear here once games are
                  completed
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Calculate statistics - safe handling for empty matchResults
    const totalMatches = matchResults?.length || 0
    const completedMatches =
      matchResults?.filter((m) => m.winner !== "TBA").length || 0
    const averageScore =
      totalMatches > 0
        ? matchResults.reduce(
            (sum, match) => sum + match.team1Score + match.team2Score,
            0
          ) /
          (totalMatches * 2)
        : 0

    // Get highest scoring game
    const highestScoringGame =
      matchResults && matchResults.length > 0
        ? matchResults.reduce((highest, current) => {
            const currentTotal = current.team1Score + current.team2Score
            const highestTotal = highest.team1Score + highest.team2Score
            return currentTotal > highestTotal ? current : highest
          }, matchResults[0])
        : null

    // Sort by date (most recent first)
    const sortedResults =
      matchResults?.sort(
        (a, b) =>
          new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime()
      ) || []

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <NavigationHeader />
        <div className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl shadow-lg">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                      Match Results
                    </h1>
                    <p className="text-gray-600 text-lg mt-1">
                      Detailed analysis of {totalMatches} matches
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="hidden md:flex gap-3">
                  <Link
                    href="/games"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    View All Games
                  </Link>
                  <Link
                    href="/standing"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    View Standings
                  </Link>
                </div>
              </div>
              <div className="h-1 w-32 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" />
            </div>

            {/* Statistics Overview - Only show if we have match results */}
            {matchResults && matchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Total Matches */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Total Matches
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {totalMatches}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Completed Matches */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Completed</p>
                      <p className="text-3xl font-bold text-green-600">
                        {completedMatches}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Average Score */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Avg Score</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {averageScore.toFixed(1)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Highest Score */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Highest Score
                      </p>
                      <p className="text-3xl font-bold text-orange-600">
                        {highestScoringGame
                          ? highestScoringGame.team1Score +
                            highestScoringGame.team2Score
                          : 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Elimination Bracket */}
            {eliminationMatches && eliminationMatches.length > 0 && (
              <div className="mb-8">
                <DisplayEliminationMatchSchedule data={eliminationMatches[0]} />
              </div>
            )}

            {/* Highest Scoring Game Highlight */}
            {highestScoringGame && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-8 h-8 text-white" />
                  <h2 className="text-2xl font-bold">Highest Scoring Game</h2>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-center">
                    {highestScoringGame.team1Logo && (
                      <div className="relative w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden border-2 border-white/30">
                        <Image
                          src={highestScoringGame.team1Logo}
                          alt={highestScoringGame.team1}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <p className="font-bold text-lg">
                      {highestScoringGame.team1}
                    </p>
                    <p className="text-3xl font-bold">
                      {highestScoringGame.team1Score}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">VS</span>
                    </div>
                    <p className="text-sm opacity-90">
                      {new Date(
                        highestScoringGame.gameDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-center">
                    {highestScoringGame.team2Logo && (
                      <div className="relative w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden border-2 border-white/30">
                        <Image
                          src={highestScoringGame.team2Logo}
                          alt={highestScoringGame.team2}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <p className="font-bold text-lg">
                      {highestScoringGame.team2}
                    </p>
                    <p className="text-3xl font-bold">
                      {highestScoringGame.team2Score}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Match Results List */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">
                  All Match Results
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  Complete history of match outcomes and scores
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {sortedResults.map((match, index) => {
                  const isTeam1Winner = match.winner === match.team1Id
                  const winnerScore = isTeam1Winner
                    ? match.team1Score
                    : match.team2Score
                  const loserScore = isTeam1Winner
                    ? match.team2Score
                    : match.team1Score
                  const scoreDifference = Math.abs(winnerScore - loserScore)

                  return (
                    <div
                      key={match.id || index}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        {/* Match Info */}
                        <div className="flex items-center gap-6">
                          {/* Date */}
                          <div className="text-center min-w-[80px]">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">
                                {new Date(match.gameDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Game #{index + 1}
                            </p>
                          </div>

                          {/* Teams */}
                          <div className="flex items-center gap-4">
                            {/* Team 1 */}
                            <div className="flex items-center gap-3">
                              {match.team1Logo && (
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                                  <Image
                                    src={match.team1Logo}
                                    alt={match.team1}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <p
                                  className={`font-semibold ${
                                    isTeam1Winner
                                      ? "text-green-600"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {match.team1}
                                </p>
                                {isTeam1Winner && (
                                  <p className="text-xs text-green-600 flex items-center gap-1">
                                    <Trophy className="w-3 h-3" />
                                    Winner
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Score */}
                            <div className="text-center px-4">
                              <div className="text-2xl font-bold text-gray-900">
                                {match.team1Score} - {match.team2Score}
                              </div>
                              <p className="text-xs text-gray-500">
                                Final Score
                              </p>
                            </div>

                            {/* Team 2 */}
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p
                                  className={`font-semibold ${
                                    !isTeam1Winner
                                      ? "text-green-600"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {match.team2}
                                </p>
                                {!isTeam1Winner && (
                                  <p className="text-xs text-green-600 flex items-center gap-1 justify-end">
                                    <Trophy className="w-3 h-3" />
                                    Winner
                                  </p>
                                )}
                              </div>
                              {match.team2Logo && (
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                                  <Image
                                    src={match.team2Logo}
                                    alt={match.team2}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Result Details */}
                        <div className="text-right">
                          <div className="flex items-center gap-4">
                            {/* Margin */}
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Margin</p>
                              <p className="font-bold text-blue-600">
                                {scoreDifference} pts
                              </p>
                            </div>

                            {/* Game Type Indicator */}
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                scoreDifference <= 5
                                  ? "bg-red-100 text-red-600"
                                  : scoreDifference <= 15
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {scoreDifference <= 5
                                ? "Close Game"
                                : scoreDifference <= 15
                                ? "Competitive"
                                : "Dominant"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/games"
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 block"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">All Games</h3>
                <p className="text-sm text-gray-600">
                  View detailed game information and highlights
                </p>
              </Link>

              <Link
                href="/standing"
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 block"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Standings</h3>
                <p className="text-sm text-gray-600">
                  Check current team rankings and statistics
                </p>
              </Link>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                <p className="text-sm text-gray-600">
                  Detailed match analysis and performance metrics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading match results:", error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <NavigationHeader />
        <div className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <p className="text-red-600 font-semibold text-lg mb-2">
                Failed to load match results
              </p>
              <p className="text-gray-600">
                Please try refreshing the page or contact support if the issue
                persists.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
