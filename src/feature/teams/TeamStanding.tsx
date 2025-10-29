import { TeamsStanding } from "@/_lib/dto/Team.model"
import { THEME } from "@/lib/theme"
import { Medal } from "lucide-react"
import Image from "next/image"

type Props = {
  teamStanding: Array<TeamsStanding>
  statistics?: Array<{
    teamId: string
    goalDifference: number
    goalsFor: number
    goalsAgainst: number
  }>
}

export default async function TeamStanding(props: Props) {
  const { teamStanding, statistics } = props

  return teamStanding?.map((standing: TeamsStanding, index: number) => {
    const winRate =
      standing.games > 0 ? (standing.win / standing.games) * 100 : 0
    const isTopThree = index < 3

    // Find the goal difference for this team from statistics
    const teamStats = statistics?.find((stat) => stat.teamId === standing.id)
    const goalDiff = teamStats?.goalDifference || 0

    return (
      <tr
        key={standing?.id || index}
        className={`group hover:bg-gray-50 transition-colors duration-200 ${
          isTopThree ? "bg-yellow-50/50" : ""
        }`}
      >
        {/* Rank */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {isTopThree ? (
              <div
                className={`${
                  index === 0
                    ? THEME.WARNING.GRADIENT
                    : index === 1
                    ? "bg-gradient-to-br from-gray-400 to-gray-500"
                    : "bg-gradient-to-br from-orange-400 to-orange-500"
                } w-8 h-8 rounded-full flex items-center justify-center shadow-md`}
              >
                <Medal className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600">
                  {index + 1}
                </span>
              </div>
            )}
          </div>
        </td>

        {/* Team Name */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
              {standing.teamLogo ? (
                <Image
                  src={standing.teamLogo}
                  alt={standing.teamName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full ${THEME.TEAMS.GRADIENT} flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-sm">
                    {standing.teamName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {standing.teamName}
            </span>
          </div>
        </td>

        {/* Wins */}
        <td className="px-4 py-4 text-center">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-50 text-green-700 font-bold text-lg">
            {standing.win}
          </span>
        </td>

        {/* Losses */}
        <td className="px-4 py-4 text-center">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-red-50 text-red-700 font-bold text-lg">
            {standing.lose}
          </span>
        </td>

        {/* Games Played */}
        <td className="px-4 py-4 text-center">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 text-blue-700 font-bold text-lg">
            {standing.games}
          </span>
        </td>

        {/* Goal Difference */}
        <td className="px-4 py-4 text-center">
          <span
            className={`inline-flex items-center justify-center min-w-[48px] h-12 rounded-lg font-bold text-lg ${
              goalDiff > 0
                ? "bg-green-50 text-green-700"
                : goalDiff < 0
                ? "bg-red-50 text-red-700"
                : "bg-gray-50 text-gray-700"
            }`}
          >
            {goalDiff > 0 ? "+" : ""}
            {goalDiff}
          </span>
        </td>

        {/* Win Percentage */}
        <td className="px-6 py-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {winRate.toFixed(1)}%
            </span>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${THEME.SUCCESS.GRADIENT} transition-all duration-500`}
                style={{ width: `${winRate}%` }}
              />
            </div>
          </div>
        </td>
      </tr>
    )
  })
}
