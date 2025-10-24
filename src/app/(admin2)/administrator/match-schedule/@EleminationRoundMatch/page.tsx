import { Match, Round } from "@/_lib/dto/MatchSchedule"
import {
  getEliminationMatchSchedule,
  getMatchSchedule,
} from "@/_lib/server/matchSchedule"
import DisplayEliminationMatchSchedule from "@/feature/MatchSchedule/DisplayEliminationMatchSchedule"
import GenerateEliminationButton from "@/feature/MatchSchedule/GenerateEliminationButton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EleminationRoundMatch() {
  const resp = await getMatchSchedule()
  const elimationResp = await getEliminationMatchSchedule()

  const isCompleted =
    resp?.length > 0 &&
    resp[0].matchSchedule.length > 0 &&
    resp[0].matchSchedule.every((val: Round) =>
      val.matches.every((dat: Match) => dat.winner !== "TBA")
    )

  if (isCompleted && elimationResp.length < 1) {
    return (
      <div className=" mx-auto w-full">
        <GenerateEliminationButton />
      </div>
    )
  }
  //console.log("Elimination Round Matches:", elimationResp[0].matchSchedule[0])
  if (elimationResp.length > 0) {
    return (
      <div className="mx-auto w-full">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/administrator/match-schedule"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Match Schedule
          </Link>
        </div>

        {/* Elimination Schedule Display */}
        <DisplayEliminationMatchSchedule data={elimationResp[0]} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full">
      <Link
        href={"/administrator/game-schedule/match-settings"}
        className=" h-10 px-6 py-2.5 has-[>svg]:px-4 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md hover:from-purple-600 hover:to-indigo-700 hover:shadow-lg transform hover:scale-105 focus-visible:ring-purple-400"
      >
        Generate Elimination Round
      </Link>
    </div>
  )
}
