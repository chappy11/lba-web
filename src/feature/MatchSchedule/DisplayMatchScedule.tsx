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
import { SECTION_BG, THEME } from "@/lib/theme"
import { Award, Medal, Trophy } from "lucide-react"

type Props = {
  data: SeasonGames
}

export default function DisplayMatchSchedule(props: Props) {
  const { data } = props
  const { matchSchedule, id } = data

  const standing = getStandings(matchSchedule)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className={`${THEME.INFO.GRADIENT_BR} p-2 rounded-lg`}>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Round Robin Matches
            </h2>
            <p className="text-sm text-gray-600">
              {matchSchedule?.length || 0} rounds scheduled
            </p>
          </div>
        </div>
        <div className={`h-1 w-24 ${THEME.INFO.GRADIENT} rounded-full mt-4`} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Matches Section */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 p-1.5 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </span>
              Match Schedule
            </h3>
            <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {matchSchedule?.map((val: MatchRound, index: number) => {
                return (
                  <div className="space-y-3" key={index + 1}>
                    <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg px-4 py-2 shadow-sm z-10">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          Round {val.round || index + 1}
                        </span>
                        <span className="text-sm text-gray-600">
                          {val.matches.length}{" "}
                          {val.matches.length === 1 ? "match" : "matches"}
                        </span>
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {val.matches.map((match: Match, i: number) => {
                        return (
                          <div
                            key={i.toString()}
                            className="transform transition-all hover:scale-[1.01]"
                          >
                            <MatchCard
                              data={match}
                              id={data.id}
                              games={data}
                              matchId={id}
                            />
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

        {/* Standings Section */}
        <div className="lg:w-[400px]">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-0">
            <div className="flex items-center gap-3 mb-4">
              <div className={`${THEME.WARNING.GRADIENT_BR} p-2 rounded-lg`}>
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Team Standings
                </h3>
                <p className="text-xs text-gray-600">Current rankings</p>
              </div>
            </div>
            <div
              className={`h-1 w-20 ${THEME.WARNING.GRADIENT} rounded-full mb-4`}
            />

            <div className="overflow-auto max-h-[700px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow className="border-b-2 border-gray-200">
                    <TableHead className="font-bold">Rank</TableHead>
                    <TableHead className="font-bold">Team</TableHead>
                    <TableHead className="text-center font-bold">W</TableHead>
                    <TableHead className="text-center font-bold">L</TableHead>
                    <TableHead className="text-end font-bold">Pts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standing.map((val, index) => {
                    const isTopThree = index < 3
                    const rankIcon =
                      index === 0 ? (
                        <Trophy className="w-4 h-4 text-yellow-500" />
                      ) : index === 1 ? (
                        <Medal className="w-4 h-4 text-gray-400" />
                      ) : index === 2 ? (
                        <Award className="w-4 h-4 text-orange-600" />
                      ) : null

                    return (
                      <TableRow
                        key={val.teamId}
                        className={`border-b border-gray-200 transition-colors hover:bg-gray-50 ${
                          isTopThree ? SECTION_BG.YELLOW : ""
                        }`}
                      >
                        <TableCell className="font-semibold">
                          <div className="flex items-center gap-2">
                            {rankIcon}
                            <span
                              className={
                                isTopThree ? "text-orange-700 font-bold" : ""
                              }
                            >
                              {index + 1}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell
                          className={`font-medium ${
                            isTopThree
                              ? "text-gray-900 font-bold"
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
                        <TableCell className="text-end font-bold text-gray-900">
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
  )
}
