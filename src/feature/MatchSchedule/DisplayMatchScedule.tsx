import { MatchRound, MatchTeam, SeasonGames } from "@/_lib/dto/MatchSchedule"
import MatchCard from "@/components/match-card"

type Props = {
  data: SeasonGames
}

export default function DisplayMatchSchedule(props: Props) {
  const { data } = props
  const { matchSchedule } = data

  console.log("mmatch Scheduel", JSON.stringify(data, null, 2))
  return (
    <div className="flex flex-col items-center justify-center h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Match Schedule</h1>
      <p className="text-gray-600">Round Robin Match.</p>
      {matchSchedule?.map((val: MatchRound, index: number) => {
        return (
          <div className=" mt-3" key={index + 1}>
            <p className=" text-lg text-white p-2 bg-slate-900">
              Round {val.round}
            </p>
            <div className=" w-full flex flex-row flex-wrap justify-center gap-4">
              {val.matches.map((val: MatchTeam, i: number) => {
                return (
                  <MatchCard
                    data={val}
                    id={data.id}
                    key={i.toString()}
                    games={data}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
