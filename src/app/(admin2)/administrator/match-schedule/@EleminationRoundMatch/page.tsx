import { Match, Round } from "@/_lib/dto/MatchSchedule"
import {
  getEliminationMatchSchedule,
  getMatchSchedule,
} from "@/_lib/server/matchSchedule"
import DisplayEliminationMatchSchedule from "@/feature/MatchSchedule/DisplayEliminationMatchSchedule"
import GenerateEliminationButton from "@/feature/MatchSchedule/GenerateEliminationButton"

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

  if (elimationResp.length > 0) {
    return <DisplayEliminationMatchSchedule data={elimationResp[0]} />
  }

  return (
    <div className="mx-auto w-full">
      <GenerateEliminationButton />
    </div>
  )
}
