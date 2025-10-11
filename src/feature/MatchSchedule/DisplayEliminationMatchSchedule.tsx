import { MatchType, Round, SeasonGames } from "@/_lib/dto/MatchSchedule"
import MatchCard from "@/components/match-card"
import { Medal, Trophy } from "lucide-react"
import DisplayMatchResult from "./DisplayMatchResult"

type Props = {
  data: SeasonGames
}

export default function DisplayEliminationMatchSchedule(props: Props) {
  const { data } = props
  const games = data?.matchSchedule as Array<Round>

  if (games?.length < 1) {
    return
  }

  const filterSemifinal = games[0].matches.filter(
    (val) => val.matchType === MatchType.SEMIFINAL.toString()
  )

  const final = games[0].matches.filter(
    (val) => val.matchType === MatchType.FINAL.toString()
  )

  const displayWinner = () => {
    if (final[0].winner !== "TBA") {
      return final[0].winner === final[0].team1Id
        ? final[0].team1
        : final[0].team2
    } else {
      return "TBA"
    }
  }

  const hasWinner = final[0].winner !== "TBA"

  console.log(games[0].matches)

  return (
    <div className="mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Bracket Section - Increased width */}
        <div className="lg:w-[65%] bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Bracket Title */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-2 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Tournament Bracket
              </h2>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full" />
          </div>

          {/* Bracket Visualization */}
          <div className="flex flex-row h-[450px] mt-8">
            {/* Semifinals */}
            <div className="flex flex-1 flex-col relative">
              {/* Bracket Connector Lines */}
              <div className="absolute inset-0 border-t-2 border-r-2 border-b-2 border-dashed border-gray-300 rounded-r-lg" />

              {/* Semifinal Match 1 */}
              <div className="absolute -bottom-7 z-10 transform hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-1 rounded-lg shadow-md">
                  <MatchCard
                    isElimination
                    isUseMatchScore={true}
                    data={filterSemifinal[0]}
                    id={filterSemifinal[0].id}
                    games={data}
                    matchId={data.id}
                  />
                </div>
                <div className="text-xs text-gray-600 font-semibold mt-1 text-center bg-blue-100 py-1 px-2 rounded">
                  Semifinal 1
                </div>
              </div>

              {/* Semifinal Match 2 */}
              <div className="absolute -top-10 z-10 transform hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-1 rounded-lg shadow-md">
                  <MatchCard
                    isElimination
                    isUseMatchScore={true}
                    data={filterSemifinal[1]}
                    id={filterSemifinal[1].id}
                    games={data}
                    matchId={data.id}
                  />
                </div>
                <div className="text-xs text-gray-600 font-semibold mt-1 text-center bg-blue-100 py-1 px-2 rounded">
                  Semifinal 2
                </div>
              </div>
            </div>

            {/* Finals */}
            <div className="flex flex-1 justify-center items-center flex-row">
              <div className="flex flex-1 justify-center">
                <div className="h-0.5 border-t-2 border-dashed border-gray-300 w-full" />
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-1 rounded-lg shadow-lg">
                  <MatchCard
                    isElimination
                    isUseMatchScore={true}
                    data={final[0]}
                    id={final[0].id}
                    games={data}
                    matchId={data.id}
                  />
                </div>
                <div className="text-xs text-gray-600 font-bold mt-1 text-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-1 px-2 rounded">
                  🏆 FINAL
                </div>
              </div>
              <div className="flex flex-1 justify-center">
                <div className="h-0.5 border-t-2 border-gray-300 w-full" />
              </div>
            </div>

            {/* Winner Display */}
            <div className="flex flex-1 justify-center items-center">
              <div className="flex flex-1 justify-start relative">
                <div
                  className={`relative ${
                    hasWinner ? "animate-pulse-slow" : ""
                  }`}
                >
                  <div className="absolute -top-8 left-0 right-0 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {hasWinner ? (
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Medal className="w-5 h-5 text-gray-400" />
                      )}
                      <h3 className="text-sm font-bold text-gray-700">
                        Champion
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`min-w-[140px] px-6 py-4 rounded-xl shadow-lg flex items-center justify-center text-center transition-all duration-300 ${
                      hasWinner
                        ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 border-2 border-yellow-600"
                        : "bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300"
                    }`}
                  >
                    {hasWinner && (
                      <Trophy className="w-6 h-6 text-white mr-2" />
                    )}
                    <p
                      className={`font-bold text-lg ${
                        hasWinner ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {displayWinner()}
                    </p>
                  </div>
                  {hasWinner && (
                    <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                      <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        ⭐ Winner
                      </div>
                    </div>
                  )}
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
}
