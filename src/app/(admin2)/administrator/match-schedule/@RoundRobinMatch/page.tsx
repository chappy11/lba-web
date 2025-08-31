import { getMatchSchedule } from "@/_lib/server/matchSchedule";
import DisplayMatchSchedule from "@/feature/MatchSchedule/DisplayMatchScedule";
import GenerateMatchSchedule from "@/feature/MatchSchedule/GenerateMatchSchedule";

export default async function RoundRobinMatch() {
  const resp = await getMatchSchedule()

  return (
    <div className=" mx-auto w-full">
      {resp.length < 1 ? (
        <GenerateMatchSchedule />
      ) : (
        <DisplayMatchSchedule data={resp[0]} />
      )}
    </div>
  )
}