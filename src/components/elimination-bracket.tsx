import { Match, MatchType, Round } from "@/_lib/dto/MatchSchedule"
import { Calendar, Medal, Trophy } from "lucide-react"
import Image from "next/image"

type Props = {
  rounds: Round[]
}

export default function EliminationBracket({ rounds }: Props) {
  if (!rounds || rounds.length === 0) {
    return null
  }

  const getRoundName = (roundNumber: number, totalRounds: number) => {
    if (roundNumber === totalRounds) return "Final"
    if (roundNumber === totalRounds - 1) return "Semifinal"
    return `Round ${roundNumber}`
  }

  // Get final match for champion display
  const finalRound = rounds[rounds.length - 1]
  const finalMatch = finalRound?.matches.find(
    (match) => match.matchType === MatchType.FINAL.toString()
  )

  const getWinner = () => {
    if (finalMatch && finalMatch.winner !== "TBA") {
      return finalMatch.winner === finalMatch.team1Id
        ? finalMatch.team1
        : finalMatch.team2
    }
    return null
  }

  const champion = getWinner()

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                Elimination Tournament Bracket
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {rounds.length} rounds • Single elimination format
              </p>
            </div>
          </div>
          {champion && (
            <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
              <Medal className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-bold">Champion: {champion}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bracket Visualization */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <div className="flex flex-row gap-6 min-w-max pb-4">
            {rounds.map((round, roundIndex) => (
              <div
                key={round.round}
                className="flex flex-col justify-center min-w-[300px]"
                style={{
                  marginTop: roundIndex > 0 ? `${Math.pow(2, roundIndex - 1) * 40}px` : "0",
                }}
              >
                {/* Round Header */}
                <div className="mb-4 sticky top-0 bg-white z-10">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg px-4 py-2 border border-gray-300">
                    <h3 className="font-bold text-gray-900 text-center">
                      {getRoundName(round.round, rounds.length)}
                    </h3>
                    <p className="text-xs text-gray-600 text-center">
                      {round.matches.length} {round.matches.length === 1 ? "match" : "matches"}
                    </p>
                  </div>
                </div>

                {/* Matches */}
                <div
                  className="space-y-4"
                  style={{
                    gap: roundIndex > 0 ? `${Math.pow(2, roundIndex) * 20}px` : "16px",
                  }}
                >
                  {round.matches.map((match: Match, matchIndex: number) => {
                    const isCompleted = match.winner !== "TBA"
                    const isTeam1Winner = match.winner === match.team1Id
                    const isTeam2Winner = match.winner === match.team2Id

                    return (
                      <div
                        key={matchIndex}
                        className={`bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 ${
                          isCompleted
                            ? "border-green-300 shadow-lg"
                            : "border-gray-200 shadow-md"
                        } overflow-hidden transition-all duration-300 hover:shadow-xl`}
                        style={{
                          marginBottom:
                            roundIndex > 0 && matchIndex < round.matches.length - 1
                              ? `${Math.pow(2, roundIndex) * 40}px`
                              : undefined,
                        }}
                      >
                        {/* Match Header */}
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-3 py-2">
                          <div className="flex items-center justify-between">
                            <span className="text-white text-xs font-semibold">
                              Match {matchIndex + 1}
                            </span>
                            {isCompleted && (
                              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                Complete
                              </span>
                            )}
                            {!isCompleted && match.gameDate && (
                              <div className="flex items-center gap-1 text-white/80 text-xs">
                                <Calendar className="w-3 h-3" />
                                {new Date(match.gameDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Team 1 */}
                        <div
                          className={`px-4 py-3 border-b ${
                            isTeam1Winner
                              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              {match.team1Logo && (
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                                  <Image
                                    src={match.team1Logo}
                                    alt={match.team1 || "Team 1"}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`font-semibold truncate ${
                                    isTeam1Winner
                                      ? "text-green-700"
                                      : match.team1 === "TBA"
                                      ? "text-gray-400 italic"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {match.team1 || "TBA"}
                                </p>
                              </div>
                              {isTeam1Winner && (
                                <Trophy className="w-4 h-4 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                            <div
                              className={`ml-3 text-2xl font-bold ${
                                isTeam1Winner ? "text-green-700" : "text-gray-900"
                              }`}
                            >
                              {isCompleted ? match.team1Score : "-"}
                            </div>
                          </div>
                        </div>

                        {/* Team 2 */}
                        <div
                          className={`px-4 py-3 ${
                            isTeam2Winner
                              ? "bg-gradient-to-r from-green-50 to-emerald-50"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              {match.team2Logo && (
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                                  <Image
                                    src={match.team2Logo}
                                    alt={match.team2 || "Team 2"}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`font-semibold truncate ${
                                    isTeam2Winner
                                      ? "text-green-700"
                                      : match.team2 === "TBA"
                                      ? "text-gray-400 italic"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {match.team2 || "TBA"}
                                </p>
                              </div>
                              {isTeam2Winner && (
                                <Trophy className="w-4 h-4 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                            <div
                              className={`ml-3 text-2xl font-bold ${
                                isTeam2Winner ? "text-green-700" : "text-gray-900"
                              }`}
                            >
                              {isCompleted ? match.team2Score : "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Champion Display */}
        {champion && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-2xl p-6 text-center shadow-xl">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Trophy className="w-10 h-10 text-white" />
                <h3 className="text-3xl font-black text-white">Tournament Champion</h3>
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <p className="text-4xl font-black text-white drop-shadow-lg">
                {champion}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
