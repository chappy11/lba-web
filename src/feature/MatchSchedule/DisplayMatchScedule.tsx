import { Match, MatchRound, SeasonGames } from "@/_lib/dto/MatchSchedule"
import { getStandings } from "@/_lib/utils/teamUtils"
// import { getStandings } from "@/_lib/utils/teamUtils";
import MatchCard from "@/components/match-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Props = {
  data: SeasonGames
}

export default function DisplayMatchSchedule(props: Props) {
  const { data } = props
  const { matchSchedule } = data

  const standing = getStandings(matchSchedule)

  return (
    <div className="flex flex-col mt-5 h-full overflow-y-auto mb-10">
      <p className="text-gray-600 text-xl font-semibold">Round Robin Match.</p>
      <div className=" flex flex-row  gap-5">
        <div className=" flex flex-1 flex-wrap gap-3">
          {matchSchedule?.map((val: MatchRound, index: number) => {
            return (
              <div className=" mt-3" key={index + 1}>
                <div className=" w-full flex flex-col flex-wrap justify-center gap-4">
                  {val.matches.map((val: Match, i: number) => {
                    return (
                      <MatchCard
                        data={val}
                        id={data.id}
                        key={i.toString()}
                        games={data}
                        matchId={val.id || ""}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        <div className=" flex flex-1">
          <Table>
            {/* <TableCaption>Team standing</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className=" text-center">Win</TableHead>
                <TableHead className=" text-center">Loss</TableHead>
                <TableHead className=" text-end">Total Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standing.map((val, index) => {
                return (
                  <TableRow
                    key={val.teamId}
                    className=" border-b border-gray-200"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{val.teamName}</TableCell>
                    <TableCell className=" text-center">{val.wins}</TableCell>
                    <TableCell className=" text-center">{val.losses}</TableCell>
                    <TableCell className=" text-end mr-5">
                      {val.goalsFor}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
