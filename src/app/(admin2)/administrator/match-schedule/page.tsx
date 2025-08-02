import { getMatchSchedule } from "@/_lib/server/matchSchedule";
import DisplayMatchSchedule from "@/feature/MatchSchedule/DisplayMatchScedule";
import GenerateMatchSchedule from "@/feature/MatchSchedule/GenerateMatchSchedule";


export default async function Page() {
  const resp = await getMatchSchedule();

  return (
    <div className=" mx-auto w-[69%] h-[90vh]">
      {resp.length < 1 ? <GenerateMatchSchedule/> : <DisplayMatchSchedule data={resp[0]}/>}
    </div>
  )
}


