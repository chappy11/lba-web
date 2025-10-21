"use client"

import { Season } from "@/_lib/dto/Season.model"
import { CoachInfo, TeamInsertPayload } from "@/_lib/dto/Team.model"
import { GameType } from "@/_lib/enums/GameTypeEnum"
import { createTeam } from "@/_lib/server/team"
import { uploadImage } from "@/_lib/server/upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { useMemo, useState } from "react"
import { toast } from "sonner"

type Props = {
  gameType: GameType
  seasonId: string
  season: Season
  currentTeamCount: number
}

export default function CreateTeam(props: Props) {
  const { gameType, seasonId, season, currentTeamCount } = props
  const [logo, setLoogo] = useState<File | null>(null)

  const [name, setName] = useState<string>("")
  const [coachFName, setCoachFName] = useState<string>("")
  const [coachMname, setCoachMName] = useState<string>("")
  const [coachLName, setCoachLName] = useState<string>("")

  const displayLogo = useMemo(() => {
    if (!logo) {
      return <div className=" h-[100px] w-[100px] bg-gray-500 rounded-full" />
    }
    const imagePath = URL.createObjectURL(logo)

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imagePath} height={100} width={100} alt="season photo" />
  }, [logo])

  async function handleSubmit() {
    try {
      // Check if team limit has been reached
      if (season.numberOfTeams && currentTeamCount >= season.numberOfTeams) {
        toast.error(
          `Team limit reached! This season allows only ${season.numberOfTeams} teams.`
        )
        return
      }

      if (!logo) {
        toast.error("Please upload a season logo")
        return
      }

      if (!name) {
        toast.error("Please enter a season name")
        return
      }

      if (!coachFName) {
        toast.error("Please enter a coach first name")
        return
      }
      if (!coachMname) {
        toast.error("Please enter a coach middle name")
        return
      }
      if (!coachLName) {
        toast.error("Please enter a coach last name")
        return
      }

      if (!gameType) {
        toast.error("Please select a game type")
        return
      }

      const formData = new FormData()
      formData.append("file", logo)

      const imgResp = await uploadImage(formData)

      const coachInfo: CoachInfo = {
        firstname: coachFName,
        middlename: coachMname,
        lastname: coachLName,
      }

      const payload: TeamInsertPayload = {
        //  seasonId: seasonId,
        teamName: name,
        coachInfo: coachInfo,
        teamLogo: imgResp?.url,
        isActive: "1",
        dateCreate: new Date().toString(),
        teamType: gameType,
        featurePlayer: null,
      }

      await createTeam(payload)

      toast.success("Team created successfully", {
        onDismiss: () => {
          window.location.reload()
        },
      })
    } catch (error) {
      console.log("ERROR", error)
      toast.error("Something went wrong")
    }
  }
  return (
    <Sheet>
      <SheetTrigger
        className=" bg-amber-800 text-white px-3 rounded-md py-2"
        disabled={
          season.numberOfTeams
            ? currentTeamCount >= season.numberOfTeams
            : false
        }
      >
        Add New Team{" "}
        {season.numberOfTeams &&
          `(${currentTeamCount}/${season.numberOfTeams})`}
      </SheetTrigger>
      <SheetContent className=" bg-neutral-800">
        <SheetHeader>
          <SheetTitle className=" text-neutral-100">Create Team</SheetTitle>
          {season.numberOfTeams && (
            <p className="text-sm text-neutral-400">
              Teams: {currentTeamCount}/{season.numberOfTeams}
              {currentTeamCount >= season.numberOfTeams && (
                <span className="text-red-400 ml-2">⚠️ Limit Reached</span>
              )}
            </p>
          )}
        </SheetHeader>
        <div className=" flex flex-col gap-5 px-3">
          <div className=" flex w-full items-center justify-center">
            {displayLogo}
          </div>
          <Input
            inputLabel="Upload Season Logo"
            type="file"
            className=" text-white"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setLoogo(file)
              }
            }}
          />
          <Input
            inputLabel="Team Name"
            placeholder=" Enter the Team Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            inputLabel="Coach Firstname"
            placeholder=" Enter Coach Firstname"
            value={coachFName}
            onChange={(e) => setCoachFName(e.target.value)}
          />
          <Input
            inputLabel="Coach Middlename"
            placeholder="Enter Coach Middlename "
            value={coachMname}
            onChange={(e) => setCoachMName(e.target.value)}
          />
          <Input
            inputLabel="Coach Lastname"
            placeholder="Enter Coach Lastname"
            value={coachLName}
            onChange={(e) => setCoachLName(e.target.value)}
          />

          <Button className=" bg-amber-600" onClick={() => handleSubmit()}>
            Submit
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
