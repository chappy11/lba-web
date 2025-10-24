import { getMatchResuts } from "@/_lib/server/matchSchedule"
import { Calendar, Target, Trophy, Users } from "lucide-react"
import Image from "next/image"

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
}

export default async function GamesPage() {
  try {
    const matchResults: MatchResult[] = await getMatchResuts()

    if (!matchResults || matchResults.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">All Games</h1>
                  <p className="text-gray-600 text-lg mt-1">
                    Complete overview of all games, winners, and results
                  </p>
                </div>
              </div>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />
            </div>

            {/* No Games State */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <Trophy className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                No Games Played Yet
              </h3>
              <p className="text-gray-500 text-lg">
                Games will appear here once matches have been completed
              </p>
            </div>
          </div>
        </div>
      )
    }

    // Separate winners and losers
    const gamesWithResults = matchResults.map((game) => {
      const winnerTeam = game.winner === game.team1Id ? game.team1 : game.team2
      const loserTeam = game.winner === game.team1Id ? game.team2 : game.team1
      const winnerScore = game.winner === game.team1Id ? game.team1Score : game.team2Score
      const loserScore = game.winner === game.team1Id ? game.team2Score : game.team1Score
      const winnerLogo = game.winner === game.team1Id ? game.team1Logo : game.team2Logo
      const loserLogo = game.winner === game.team1Id ? game.team2Logo : game.team1Logo

      return {
        ...game,
        winnerTeam,
        loserTeam,
        winnerScore,
        loserScore,
        winnerLogo,
        loserLogo,
      }
    })

    // Sort by date (most recent first)
    const sortedGames = gamesWithResults.sort((a, b) => 
      new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime()
    )

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">All Games</h1>
                  <p className="text-gray-600 text-lg mt-1">
                    Complete overview of {matchResults.length} games played
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="hidden md:flex gap-4">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">{matchResults.length}</p>
                  <p className="text-sm text-gray-600">Total Games</p>
                </div>
                <div className="bg-white rounded-lg shadow-md border border-gray-200 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {matchResults.filter(g => g.winner !== "TBA").length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </div>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedGames.map((game, index) => (
              <div
                key={game.id || index}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {/* Game Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">
                        {new Date(game.gameDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-sm font-medium">
                        Game #{index + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Game Content */}
                <div className="p-6">
                  {/* Teams Matchup */}
                  <div className="grid grid-cols-3 gap-4 items-center mb-6">
                    {/* Team 1 */}
                    <div className="text-center">
                      {game.team1Logo && (
                        <div className="relative w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-200 shadow-lg">
                          <Image
                            src={game.team1Logo}
                            alt={game.team1}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-gray-900 text-lg">
                        {game.team1}
                      </h3>
                      <p className="text-3xl font-bold text-blue-600 mt-2">
                        {game.team1Score}
                      </p>
                    </div>

                    {/* VS Badge */}
                    <div className="text-center">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto shadow-lg">
                        <span className="text-white font-bold text-sm">VS</span>
                      </div>
                    </div>

                    {/* Team 2 */}
                    <div className="text-center">
                      {game.team2Logo && (
                        <div className="relative w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-200 shadow-lg">
                          <Image
                            src={game.team2Logo}
                            alt={game.team2}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-gray-900 text-lg">
                        {game.team2}
                      </h3>
                      <p className="text-3xl font-bold text-blue-600 mt-2">
                        {game.team2Score}
                      </p>
                    </div>
                  </div>

                  {/* Winner/Loser Section */}
                  {game.winner !== "TBA" && (
                    <div className="border-t border-gray-200 pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Winner */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              Winner
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {game.winnerLogo && (
                              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-green-300">
                                <Image
                                  src={game.winnerLogo}
                                  alt={game.winnerTeam}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-green-900">
                                {game.winnerTeam}
                              </p>
                              <p className="text-sm text-green-700">
                                {game.winnerScore} points
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Loser */}
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-red-600" />
                            <span className="text-sm font-medium text-red-800">
                              Runner-up
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {game.loserLogo && (
                              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-red-300">
                                <Image
                                  src={game.loserLogo}
                                  alt={game.loserTeam}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-red-900">
                                {game.loserTeam}
                              </p>
                              <p className="text-sm text-red-700">
                                {game.loserScore} points
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Score Difference */}
                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                          Margin of victory:{" "}
                          <span className="font-bold text-blue-600">
                            {Math.abs(game.winnerScore - game.loserScore)} points
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">All Results</h3>
              <p className="text-sm text-gray-600">
                Complete game history with winners and scores
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Team Performance</h3>
              <p className="text-sm text-gray-600">
                Track how each team performs over time
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Season Progress</h3>
              <p className="text-sm text-gray-600">
                Monitor the ongoing tournament progress
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading games:", error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-semibold text-lg mb-2">
              Failed to load games
            </p>
            <p className="text-gray-600">
              Please try refreshing the page or contact support if the issue persists.
            </p>
          </div>
        </div>
      </div>
    )
  }
}