import { getMatchSchedule } from "@/_lib/server/matchSchedule";
import DisplayMatchSchedule from "@/feature/MatchSchedule/DisplayMatchScedule";
import GenerateMatchSchedule from "@/feature/MatchSchedule/GenerateMatchSchedule";

export default async function RoundRobinMatch() {
  const resp = await getMatchSchedule()

  return (
    <div className="mx-auto w-full">
      {resp.length < 1 ? (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg border border-gray-200 p-8">
          <GenerateMatchSchedule />
        </div>
      ) : (
        <DisplayMatchSchedule data={resp[0]} />
      )}
    </div>
  )
}