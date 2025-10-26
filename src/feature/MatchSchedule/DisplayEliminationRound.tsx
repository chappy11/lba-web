import { MatchType, Round, SeasonGames } from "@/_lib/dto/MatchSchedule"
import MatchCard from "@/components/match-card"
import { Medal, Trophy, Users } from "lucide-react"
import DisplayMatchResult from "./DisplayMatchResult"

type Props = {
  eliminationMatches: SeasonGames[]
}

export default function DisplayEliminationRound(props: Props) {
  const { eliminationMatches } = props

  if (!eliminationMatches || eliminationMatches.length === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      {eliminationMatches.map((elimination, eliminationIndex) => {
        const { matchSchedule, id } = elimination
        const games = matchSchedule as Array<Round>

        if (games?.length < 1) {
          return (
            <div key={eliminationIndex} className="mx-auto w-full p-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Elimination Matches
                </h3>
                <p className="text-gray-500">
                  The elimination bracket has not been created yet.
                </p>
              </div>
            </div>
          )
        }

        const allRounds = games

        // Calculate tournament structure information
        const totalMatches = allRounds.reduce(
          (total, round) => total + round.matches.length,
          0
        )

        // Get final match for winner display
        const finalRound = allRounds[allRounds.length - 1]
        const finalMatch = finalRound?.matches.find(
          (match) => match.matchType === MatchType.FINAL.toString()
        )

        const getWinner = () => {
          if (finalMatch && finalMatch.winner !== "TBA") {
            return finalMatch.winner === finalMatch.team1Id
              ? finalMatch.team1
              : finalMatch.team2
          }
          return "TBA"
        }

        const hasWinner = finalMatch && finalMatch.winner !== "TBA"

        const getRoundName = (roundNumber: number, totalRounds: number) => {
          if (roundNumber === totalRounds) return "Final"
          if (roundNumber === totalRounds - 1) return "Semifinal"
          
          // For all other rounds, just use the round number
          return `Round ${roundNumber}`
        }

        return (
          <div key={eliminationIndex} className="mx-auto w-full">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Dynamic Bracket Section */}
              <div className="lg:w-[70%] bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                {/* Bracket Title */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-lg">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Elimination Tournament Bracket
                      </h2>
                      <p className="text-sm text-gray-600">
                        {totalMatches} total matches • {allRounds.length} rounds
                      </p>
                    </div>
                  </div>
                  <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full" />
                </div>

                {/* Dynamic Bracket Visualization */}
                <div className="overflow-x-auto">
                  <div className="flex flex-row gap-8 min-w-max p-4">
                    {allRounds.map((round, roundIndex) => (
                      <div
                        key={round.round}
                        className="flex flex-col justify-center min-w-[280px]"
                      >
                        {/* Round Header */}
                        <div className="text-center mb-4">
                          <div
                            className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm ${
                              round.matches.some(
                                (m) =>
                                  m.matchType === MatchType.FINAL.toString()
                              )
                                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                                : round.matches.some(
                                    (m) =>
                                      m.matchType ===
                                      MatchType.SEMIFINAL.toString()
                                  )
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                                : "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                            }`}
                          >
                            {getRoundName(round.round, allRounds.length)}
                          </div>
                        </div>

                        {/* Matches in this round */}
                        <div className="space-y-6">
                          {round.matches.map((match) => (
                            <div key={match.id} className="relative">
                              {/* Connection lines for non-final rounds */}
                              {roundIndex < allRounds.length - 1 && (
                                <div className="absolute -right-4 top-1/2 w-8 h-0.5 bg-gray-300 z-0" />
                              )}

                              {/* Match Card */}
                              <div
                                className={`transform hover:scale-105 transition-all duration-300 z-10 relative ${
                                  round.matches.some(
                                    (m) =>
                                      m.matchType === MatchType.FINAL.toString()
                                  )
                                    ? "bg-gradient-to-r from-yellow-50 to-orange-50 p-2 rounded-lg shadow-lg"
                                    : "bg-gradient-to-r from-purple-50 to-indigo-50 p-2 rounded-lg shadow-md"
                                }`}
                              >
                                <MatchCard
                                  isElimination={true}
                                  isUseMatchScore={true}
                                  data={match}
                                  id={match.id}
                                  games={elimination}
                                  matchId={id}
                                />
                              </div>

                              {/* TBA indicator */}
                              {(match.team1 === "TBA" ||
                                match.team2 === "TBA") && (
                                <div className="text-xs text-center mt-1">
                                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                    Awaiting Teams
                                  </span>
                                </div>
                              )}

                              {/* Bye indicator */}
                              {(match.team1 === "" || match.team2 === "") &&
                                match.team1 !== "TBA" &&
                                match.team2 !== "TBA" && (
                                  <div className="text-xs text-center mt-1">
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                                      Bye
                                    </span>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Winner Display */}
                    <div className="flex flex-col justify-center min-w-[200px]">
                      <div className="text-center mb-4">
                        <div className="inline-block px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          🏆 Champion
                        </div>
                      </div>

                      <div
                        className={`relative ${
                          hasWinner ? "animate-pulse-slow" : ""
                        }`}
                      >
                        <div
                          className={`min-w-[160px] px-6 py-8 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-all duration-300 ${
                            hasWinner
                              ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 border-2 border-yellow-600"
                              : "bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300"
                          }`}
                        >
                          {hasWinner ? (
                            <Trophy className="w-8 h-8 text-white mb-2" />
                          ) : (
                            <Medal className="w-8 h-8 text-gray-400 mb-2" />
                          )}
                          <p
                            className={`font-bold text-lg ${
                              hasWinner ? "text-white" : "text-gray-500"
                            }`}
                          >
                            {getWinner()}
                          </p>
                          {hasWinner && (
                            <div className="mt-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                              ⭐ Winner
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Results Section - Reduced width to give more space to bracket */}
              <div className="lg:w-[35%] bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Match History
                    </h2>
                    <p className="text-sm text-gray-600">
                      Completed elimination matches
                    </p>
                  </div>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6" />

                <div className="flex flex-1">
                  <DisplayMatchResult />
                </div>
              </div>
            </div>

            {/* Spacer */}
            <div className="h-12" />
          </div>
        )
      })}
    </div>
  )
}