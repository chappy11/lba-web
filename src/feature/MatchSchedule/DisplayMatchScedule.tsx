import { Match, MatchRound, SeasonGames } from "@/_lib/dto/MatchSchedule"
// import { getStandings } from "@/_lib/utils/teamUtils";
import MatchCard from "@/components/match-card"

type Props = {
  data: SeasonGames
}

export default function DisplayMatchSchedule(props: Props) {
  const { data } = props
  const { matchSchedule } = data

  // const standing = getStandings(
  // 	matchSchedule
  // );

  return (
    <div className="flex flex-col mt-5 h-full overflow-y-auto">
      <p className="text-gray-600">Round Robin Match.</p>
      <div className=" flex flex-row flex-wrap gap-5">
        {matchSchedule?.map((val: MatchRound, index: number) => {
          return (
            <div className=" mt-3" key={index + 1}>
              <p className=" text-lg text-white p-2 bg-slate-900">
                Round {val.round}
              </p>
              <div className=" w-full flex flex-col flex-wrap justify-center gap-4">
                {val.matches.map((val: Match, i: number) => {
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
    </div>
  )
}
