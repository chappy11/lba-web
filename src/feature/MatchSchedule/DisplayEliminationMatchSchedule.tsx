import { MatchType, Round, SeasonGames } from "@/_lib/dto/MatchSchedule"
import MatchCard from "@/components/match-card"
import DisplayMatchResult from "./DisplayMatchResult"

type Props = {
  data: SeasonGames
}

export default function DisplayEliminationMatchSchedule(props: Props) {
  const { data } = props
  const games = data?.matchSchedule as Array<Round>

  if (games?.length < 1) {
    return
  }

  const filterSemifinal = games[0].matches.filter(
    (val) => val.matchType === MatchType.SEMIFINAL.toString()
  )

  const final = games[0].matches.filter(
    (val) => val.matchType === MatchType.FINAL.toString()
  )

  const displayWinner = () => {
    if (final[0].winner !== "TBA") {
      return final[0].winner === final[0].team1Id
        ? final[0].team1
        : final[0].team2
    } else {
      return "TBA"
    }
  }

  console.log(games[0].matches)

  return (
    <div className=" mx-auto w-full">
      <div className=" flex flex-1 flex-row">
        <div className=" flex flex-row w-[60%] h-[400px]  mt-12">
          <div className=" flex flex-1 flex-col relative border-dashed border-t-1 border-t-black border-r-1 border-r-black border-b-1 border-b-black border-r-1 border-r-black ">
            <div className="   absolute -bottom-7 ">
              <MatchCard
                isElimination
                isUseMatchScore={true}
                data={filterSemifinal[0]}
                id={filterSemifinal[0].id}
                games={data}
                matchId={data.id}
              />
            </div>
            <div className="   absolute -top-10">
              <MatchCard
                isElimination
                isUseMatchScore={true}
                data={filterSemifinal[1]}
                id={filterSemifinal[1].id}
                games={data}
                matchId={data.id}
              />
            </div>
          </div>
          <div className=" flex  flex-1 justify-center items-center flex flex-row">
            <div className=" flex flex-1 justify-center">
              <div className=" h-1 border-t-1 border-dashed border-black w-full " />
            </div>
            <div className="   ">
              <MatchCard
                isElimination
                isUseMatchScore={true}
                data={final[0]}
                id={final[0].id}
                games={data}
                matchId={data.id}
              />
            </div>
            <div className=" flex flex-1 justify-center">
              <div className=" h-1 border-t-1 border-black w-full " />
            </div>
          </div>
          <div className=" flex  flex-1 justify-center items-center flex flex-row">
            <div className=" flex flex-1 justify-start relative">
              <h1 className=" absolute -top-6">Game Winner</h1>
              <div className=" h-[50px] w-[100px] border border-gray-300 rounded-md  jusitfy-center items-center flex text-center">
                <p className=" text-center w-full">{displayWinner()}</p>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-1 flex-col w-full">
          <p className=" text-2xl font-bold">Elimination Round</p>
          <div className=" flex flex-1 ">
            <DisplayMatchResult />
          </div>
        </div>
      </div>

      <div className=" h-[50px]" />
    </div>
  )
}
