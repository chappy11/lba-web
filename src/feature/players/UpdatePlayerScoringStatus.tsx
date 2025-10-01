import {
    PlayerGameInfo,
    PlayerStatusPayload
} from "@/_lib/dto/TeamScoring.model"
import { createPlayerStatus } from "@/_lib/server/playerStatus"
import TextInput from "@/components/textinput"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import React from "react"
import Swal from "sweetalert2"

type Props = PlayerStatusPayload

export default function UpdatePlayerScoringStatus(props: Props) {
  const {
    player,
    threepoints,
    points,
    foul,
    assist,
    steal,
      id,
      gameId,
    playerId
  } = props
  const [pointsValue, setPointsValue] = React.useState<string>(
    points?.toString()
  )
    

   const [reboundValue,setReboundValue] = React.useState<string>(props.rebound?.toString() || "0") 
  const [threePointsValue, setThreePointsValue] = React.useState<string>(
    threepoints?.toString()
  )
  const [foulValue, setFoulValue] = React.useState<string>(foul?.toString())
  const [assistValue, setAssistValue] = React.useState<string>(
    assist?.toString()
  )
    const [stealValue, setStealValue] = React.useState<string>(steal?.toString())
    const [isLoading,setIsLoading] = React.useState<boolean>(false)

  async function handleUpdate() {
      try {
       
          setIsLoading(true)
          const playerData: PlayerGameInfo = {
              id: player?.id || "",
              firstname: player?.firstname || "",
              middlename: player?.middlename || "",
              lastname: player?.lastname || "",
              jerseyNumber: player?.jerseyNumber || "",
              playerImage: player?.playerImage || "",
              position: player?.position || "",
          }
          const payload: PlayerStatusPayload = {
              id: id ?? null,
              playerId: playerId,
              gameId: gameId,
              points: parseInt(pointsValue) || 0,
              threepoints: parseInt(threePointsValue) || 0,
              foul: parseInt(foulValue) || 0,
              assist: parseInt(assistValue) || 0,
              steal: parseInt(stealValue) || 0,
              rebound: parseInt(reboundValue) || 0,
              player: playerData,
          }

          const resp = await createPlayerStatus(payload)

          if (resp) {
              Swal.fire({
                  icon: "success",
                  title: "Success",
                  text: "Player status updated successfully",
              }).then((val) => {
                  window.location.reload()
              })
          }
      } catch (error) {
          Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to update player status",
          })
      } finally { 
          setIsLoading(false)
      }
  }
  return (
    <Sheet>
      <SheetTrigger className=" bg-black px-3 py-2 rounded-md text-white">
        Update
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update Player Score</SheetTitle>
          <SheetDescription></SheetDescription>
          <div className=" flex flex-col gap-3">
            {player?.firstname} {player?.lastname}
            <TextInput
              label="Points"
              value={pointsValue}
              onChange={(e) => setPointsValue(e.target.value)}
            />
            <TextInput
              label="Three Points"
              value={threePointsValue}
              onChange={(e) => setThreePointsValue(e.target.value)}
            />
            <TextInput
              label="Foul"
              value={foulValue}
              onChange={(e) => setFoulValue(e.target.value)}
            />
            <TextInput
              label="Assist"
              value={assistValue}
              onChange={(e) => setAssistValue(e.target.value)}
            />
            <TextInput
              label="Steal"
              value={stealValue}
              onChange={(e) => setStealValue(e.target.value)}
            />
            <TextInput
              label="Rebound"
              value={reboundValue}
              onChange={(e) => setReboundValue(e.target.value)}
            />
          </div>
          <Button onClick={() => handleUpdate()}>
            {isLoading ? "Loading.." : "Update"}
          </Button>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
