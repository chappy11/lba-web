"use client"

import { Player } from "@/_lib/dto/Player.model"
import { FeaturePlayerInfo, Team, UpdateTeam } from "@/_lib/dto/Team.model"
import { GameType } from "@/_lib/enums/GameTypeEnum"
import { updateTeamById } from "@/_lib/server/team"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Star } from "lucide-react"
import Image from "next/image"

import { useState } from "react"
import Swal from "sweetalert2"

type Props = {
  player: Player
  team: Team
}

export default function UpdateFeaturePlayer(props: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { player, team } = props

  async function handleSubmit() {
    try {
      setIsLoading(true)

      const playerFeature: FeaturePlayerInfo = {
        firstname: player.firstname,
        lastname: player.lastname,
        position: player.position,
        jerseyNumber: player.jerseyNumber,
        playerImage: player.playerImage,
        id: (player.id as string) || "",
        middlename: player.middlename || "",
        age: player.age || 0,
        dateCreated: player.dateCreated || "",
        playerType: player.playerType || "",
        height: player.height || "0",
        weight: player.weight || "0",
      }
      const payload: UpdateTeam = {
        teamLogo: team.teamLogo,
        teamName: team.teamName,
        coachInfo: { ...team.coachInfo },
        isActive: "",
        seasonId: team.seasonId || "",
        teamType: GameType.BASKETBALL,
        featurePlayer: playerFeature,
        dateCreate: team.dateCreate || "",
      }

      const resp = await updateTeamById(team.id as string, payload)

      if (!resp) {
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: "You cannot update feature player at this moment",
        })
        return
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Feature player updated successfully",
        timer: 2000,
      }).then((val) => {
        window.location.reload()
      })
    } catch (error) {
      console.log("ERROR", error)
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "You cannot update feature player at this moment",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Star color="orange" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${player.firstname.toUpperCase()} ${player.lastname.toUpperCase()}`}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className=" flex flex-row flex-wrap gap-3">
          {/* <div>{displayImage}</div> */}
          <div className=" flex flex-col gap-2">
            <p>Position: {player.position}</p>
            <p>Jersey Number: {player.jerseyNumber}</p>
            <p>Age: {player.age}</p>
            <Button onClick={() => handleSubmit()}>
              {isLoading ? "Loading..." : "Set as Feature Player"}
            </Button>
          </div>
          <div className=" flex flex-1 justify-end items-start">
            <Image
              src={player.playerImage}
              width={300}
              height={300}
              alt="Player"
              className=" rounded-full h-[150px] w-[150px]"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
  