import { GameType } from "@/_lib/dto/MatchSchedule"
import {
  getEliminationMatchSchedule,
  getMatchSchedule,
} from "@/_lib/server/matchSchedule"
import DisplayMatchSchedule from "@/feature/MatchSchedule/DisplayMatchScedule"
import GenerateMatchSchedule from "@/feature/MatchSchedule/GenerateMatchSchedule"

export default async function Page() {
  const resp = await getMatchSchedule()

  const elimationResp = await getEliminationMatchSchedule()

  console.log("RESP", elimationResp)
  return (
    <div className=" mx-auto w-[69%] h-[90vh]">
      {elimationResp.length < 1 ? <p>NO DATA</p> : <p>DATA</p>}
      {resp.length < 1 ? (
        <GenerateMatchSchedule gameType={GameType.ELIMINATION} />
      ) : (
        <DisplayMatchSchedule data={resp[0]} />
      )}
    </div>
  )
}
