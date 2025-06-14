import { Game, GameStatus, GameTeamInfo, UpdateGamePayload } from "@/_lib/dto/Game.model"
import { updateGameId } from "@/_lib/server/game"
import TextInput from "@/components/textinput"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { toast } from "sonner"
type Props = {
  game: Game
}
export default function UpdateGame(props: Props) {
  const { game } = props

  console.log("GAME",game)
  const [currentTeamOneScore, setCurrentTeamOneScore] = useState<string>(
    game?.teamOneScore.toString() || "0"
  )
  const [currentTeamTwoScore, setCurrentTeamTwoScore] = useState<string>(
    game?.teamTwoScore.toString() || "0"
  )
  const [currentStatus, setCurrentStatus] = useState<GameStatus>(
    game?.gameStatus || GameStatus.PENDING
  )

  if (!game) {
    return (
      <div className=" h-screen w-screen flex flex-1 justify-center items-center">
        <p>Game Not Found</p>
      </div>
    )
  }

  async function handleUpdateGame() { 
    try {
      let winner:GameTeamInfo |null = null;

      if (
        parseInt(currentTeamOneScore) > 0 &&
        parseInt(currentTeamTwoScore) > 0
      ) {
        if (currentTeamOneScore > currentTeamTwoScore) {
          winner = game.teamOne 
        } else if (currentTeamTwoScore > currentTeamOneScore) {
          winner = game.teamTwo 
        }
      }

      const payload:UpdateGamePayload = {
        ...game,
        teamOneScore: parseInt(currentTeamOneScore),
        teamTwoScore: parseInt(currentTeamTwoScore),
        gameStatus: currentStatus,
        gameWinner:winner
      }


      
      const resp = await updateGameId(game.id as string, payload);

      if (resp) {
        toast.success("Game updated successfully");
      }
    } catch (error) {
      console.log("ERROR",error)
      toast.error("Failed to update game", {
        description: "Please try again later.",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger className=" py-2 px-4 rounded-sm bg-black text-white">
        Update
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Game</DialogTitle>
          <DialogDescription>
            This dialog allows you to update the game details. You can change
            the game status, teams, and other relevant information.
          </DialogDescription>
        </DialogHeader>
        <div className=" flex flex-1 flex-col gap-2">
          <TextInput
            type="number"
            label="Team One Score"
            value={currentTeamOneScore}
            onChange={(e) => setCurrentTeamOneScore(e.target.value)}
          />
          <TextInput
            type="number"
            label="Team Two Score"
            value={currentTeamTwoScore}
            onChange={(e) => setCurrentTeamTwoScore(e.target.value)}
          />
          <div className=" flex flex-col gap-2">
            <Label>Game Status</Label>
            <Select
              value={currentStatus}
              onValueChange={(value) =>
                setCurrentStatus(value as unknown as GameStatus)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Game status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GameStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={GameStatus.ONGOING}>On-Going</SelectItem>
                <SelectItem value={GameStatus.DONE}>Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className=" py-3 flex flex-row justify-end gap-2">
            <Button className=" w-[100px]" onClick={() => handleUpdateGame()}>
              Save
            </Button>
            <Button variant="ghost" className=" w-[100px] text-red-500">
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
