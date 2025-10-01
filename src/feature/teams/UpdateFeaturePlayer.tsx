"use client"

import { Player } from "@/_lib/dto/Player.model"
import { FeaturePlayerInfo, Team, UpdateTeam } from "@/_lib/dto/Team.model"
import { GameType } from "@/_lib/enums/GameTypeEnum"
import { updateTeamById } from "@/_lib/server/team"
import { uploadImage } from "@/_lib/server/upload"
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
import { Star } from "lucide-react"
import Image from "next/image"

import { useMemo, useState } from "react"
import Swal from "sweetalert2"

type Props = {
  player: Player
  team: Team
}

export default function UpdateFeaturePlayer(props: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { player, team } = props

  const [image, setImage] = useState<File | Blob | null>(null)

  async function handleSubmit() {
    try {
      setIsLoading(true)

      const formData = new FormData()
      formData.append("file", image as Blob)

      const imageResp = await uploadImage(formData)
      const playerFeature: FeaturePlayerInfo = {
        firstname: player.firstname,
        lastname: player.lastname,
        position: player.position,
        jerseyNumber: player.jerseyNumber,
        playerImage: imageResp.url,
        id: (player.id as string) || "",
        middlename: player.middlename || "",
        age: player.age || 0,
        dateCreated: player.dateCreated || "",
      }
      const payload: UpdateTeam = {
        teamLogo: team.teamLogo,
        teamName: team.teamName,
        coachInfo: { ...team.coachInfo },
        dateCreate: "",
        isActive: "",
        seasonId: "",
        teamType: GameType.BASKETBALL,
        featurePlayer: playerFeature,
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
      }).then((val) => {
        window.location.reload()
      })
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "You cannot update feature player at this moment",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const displayImage = useMemo(() => {
    if (!image) {
      return (
        <div className=" w-50 flex flex-col items-center gap-2">
          <div className=" w-[100px] h-[100px] bg-gray-200 rounded-full" />
          <TextInput
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-[100px]"
          />
        </div>
      )
    }

    const url = URL.createObjectURL(image)

    return <Image src={url} width={200} height={100} alt="Player" />
  }, [image])

  return (
    <Dialog>
      <DialogTrigger>
        <Star color="orange" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feature Player</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className=" flex flex-row flex-wrap gap-3">
          <div>{displayImage}</div>
          <div className=" flex flex-col gap-2">
            <p>Name: {`${player.firstname} ${player.lastname}`}</p>
            <p>Position: {player.position}</p>
            <p>Jersey Number: {player.jerseyNumber}</p>
            <Button onClick={() => handleSubmit()}>
              {isLoading ? "Loading..." : "Set as Feature Player"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
  