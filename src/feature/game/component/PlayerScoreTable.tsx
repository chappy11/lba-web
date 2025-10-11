import { Game } from "@/_lib/dto/Game.model"
import { GamePlayer } from "@/_lib/dto/GamePlayer.model"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import UpdatePlayerScore from "./UpdatePlayerScore"

type Props = {
  game: Game
  gameId: string
  playerRecord: Array<GamePlayer>
  isTeamOne: boolean
}

export default function PlayerScoreTable(props: Props) {
  const { playerRecord, gameId, isTeamOne, game } = props
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-indigo-200">
            <TableHead className="font-bold text-gray-900">
              Player Name
            </TableHead>
            <TableHead className="font-bold text-gray-900 text-center">
              REB
            </TableHead>
            <TableHead className="font-bold text-gray-900 text-center">
              AST
            </TableHead>
            <TableHead className="font-bold text-gray-900 text-center">
              3-PTS
            </TableHead>
            <TableHead className="font-bold text-gray-900 text-center">
              FOUL
            </TableHead>
            <TableHead className="font-bold text-gray-900 text-center">
              PTS
            </TableHead>
            <TableHead className="font-bold text-gray-900 text-center">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {playerRecord?.map((player, index) => (
            <TableRow
              key={player.playerId}
              className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
            >
              <TableCell className="font-semibold text-gray-900">
                {player.player.firstname} {player.player.middlename}{" "}
                {player.player.lastname}
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center justify-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold min-w-[50px]">
                  {player.rebound}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center justify-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold min-w-[50px]">
                  {player.assist}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center justify-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold min-w-[50px]">
                  {player.threepoints}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center justify-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold min-w-[50px]">
                  {player.foul}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-bold min-w-[50px] shadow-md">
                  {player.points}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <UpdatePlayerScore
                  {...player}
                  gameId={gameId}
                  isTeamOne={isTeamOne}
                  game={game}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
