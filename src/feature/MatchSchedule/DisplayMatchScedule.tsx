import { Match, MatchRound, SeasonGames } from "@/_lib/dto/MatchSchedule"
import { getStandings } from "@/_lib/utils/teamUtils"
import MatchCard from "@/components/match-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Award, Calendar, Clock, Medal, Trophy, Users } from "lucide-react"
import DisplayEliminationRound from "./DisplayEliminationRound"
import GenerateRoundRobinElimination from "./GenerateRoundRobinElimination"

type Props = {
  data: SeasonGames
  eliminationMatches: SeasonGames[]
}

export default function DisplayMatchSchedule(props: Props) {
  const { data, eliminationMatches } = props
  const { matchSchedule, id } = data

  const standing = getStandings(matchSchedule)

  // Calculate tournament stats
  const totalMatches =
    matchSchedule?.reduce((total, round) => total + round.matches.length, 0) ||
    0
  const completedMatches =
    matchSchedule?.reduce(
      (total, round) =>
        total + round.matches.filter((match) => match.winner !== "TBA").length,
      0
    ) || 0

  // const getData = useCallback(() => {
  //   try {
  //     const
  //   } catch (error) {

  //   }
  // },[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {totalMatches === completedMatches &&
          totalMatches > 0 &&
          eliminationMatches.length < 1 && (
            <GenerateRoundRobinElimination
              matchSchedule={matchSchedule}
              totalMatches={totalMatches}
              completedMatches={completedMatches}
              standing={standing}
            />
          )}
        {eliminationMatches.length > 0 && (
          <DisplayEliminationRound eliminationMatches={eliminationMatches} />
        )}
        {/* Enhanced Header with Stats */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Round Robin Tournament
                  </h2>
                  <p className="text-blue-100 mt-1">
                    {matchSchedule?.length || 0} rounds • {totalMatches} total
                    matches
                  </p>
                </div>
              </div>

              {/* Stats Pills */}
              <div className="flex gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="text-white text-sm font-medium">
                    Completed
                  </div>
                  <div className="text-white text-lg font-bold">
                    {completedMatches}/{totalMatches}
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="text-white text-sm font-medium">Teams</div>
                  <div className="text-white text-lg font-bold">
                    {standing.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tournament Completion Check & Elimination Generation */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Match Schedule
                    </h3>
                    <p className="text-gray-300 text-sm">
                      All tournament matches organized by rounds
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Scrollable Content */}
              <div className="p-6">
                <div className="space-y-8 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {matchSchedule?.map((val: MatchRound, index: number) => {
                    const roundMatches = val.matches
                    const completedInRound = roundMatches.filter(
                      (m) => m.winner !== "TBA"
                    ).length

                    return (
                      <div className="space-y-4" key={index + 1}>
                        {/* Enhanced Round Header */}
                        <div className="sticky top-0 z-10">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-xl p-4 shadow-sm backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-md">
                                  Round {val.round || index + 1}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm font-medium">
                                    {roundMatches.length}{" "}
                                    {roundMatches.length === 1
                                      ? "match"
                                      : "matches"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  {completedInRound}/{roundMatches.length}{" "}
                                  Complete
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Grid Layout for Match Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {roundMatches.map((match: Match, i: number) => {
                            return (
                              <div
                                key={i.toString()}
                                className="group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                              >
                                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-1 shadow-sm group-hover:shadow-md transition-all">
                                  <MatchCard
                                    data={match}
                                    id={data.id}
                                    games={data}
                                    matchId={id}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="xl:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden sticky top-6">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Team Standings
                    </h3>
                    <p className="text-yellow-100 text-sm">
                      Live tournament rankings
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Table */}
              <div className="p-6">
                <div className="overflow-auto max-h-[700px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow className="border-b-2 border-gray-200">
                        <TableHead className="font-bold text-gray-900">
                          Rank
                        </TableHead>
                        <TableHead className="font-bold text-gray-900">
                          Team
                        </TableHead>
                        <TableHead className="text-center font-bold text-gray-900">
                          W
                        </TableHead>
                        <TableHead className="text-center font-bold text-gray-900">
                          L
                        </TableHead>
                        <TableHead className="text-end font-bold text-gray-900">
                          Pts
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {standing.map((val, index) => {
                        const isTopThree = index < 3
                        const isFirst = index === 0
                        const rankIcon =
                          index === 0 ? (
                            <div className="bg-yellow-100 p-1 rounded-full">
                              <Trophy className="w-4 h-4 text-yellow-600" />
                            </div>
                          ) : index === 1 ? (
                            <div className="bg-gray-100 p-1 rounded-full">
                              <Medal className="w-4 h-4 text-gray-500" />
                            </div>
                          ) : index === 2 ? (
                            <div className="bg-orange-100 p-1 rounded-full">
                              <Award className="w-4 h-4 text-orange-600" />
                            </div>
                          ) : null

                        return (
                          <TableRow
                            key={val.teamId}
                            className={`border-b border-gray-200 transition-all hover:bg-gray-50 ${
                              isFirst
                                ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                                : isTopThree
                                ? "bg-gradient-to-r from-blue-50 to-indigo-50"
                                : ""
                            }`}
                          >
                            <TableCell className="font-semibold">
                              <div className="flex items-center gap-2">
                                {rankIcon}
                                <span
                                  className={`${
                                    isFirst
                                      ? "text-yellow-700 font-bold text-lg"
                                      : isTopThree
                                      ? "text-blue-700 font-bold"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {index + 1}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell
                              className={`font-medium ${
                                isFirst
                                  ? "text-yellow-900 font-bold"
                                  : isTopThree
                                  ? "text-blue-900 font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              {val.teamName}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                {val.wins}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                                {val.losses}
                              </span>
                            </TableCell>
                            <TableCell
                              className={`text-end font-bold ${
                                isFirst
                                  ? "text-yellow-700"
                                  : isTopThree
                                  ? "text-blue-700"
                                  : "text-gray-900"
                              }`}
                            >
                              {val.goalsFor}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
