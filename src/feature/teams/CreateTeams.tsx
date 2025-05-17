"use client"

import { CoachInfo } from "@/_lib/dto/Team.model"
import { GameType } from "@/_lib/enums/GameTypeEnum"
import { createTeam } from "@/_lib/server/team"
import { uploadImage } from "@/_lib/server/upload"
import TextInput from "@/components/textinput"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { toast } from "sonner"

export default function CreateTeam() {
  const [logo, setLoogo] = useState<File | null>(null)

  const [name, setName] = useState<string>("")
  const [coachFName, setCoachFName] = useState<string>("")
  const [coachMname, setCoachMName] = useState<string>("")
  const [coachLName, setCoachLName] = useState<string>("")

  const [isDisplayAddPlayer, setIsDisplayAddPlayer] = useState<boolean>(false)

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

      const formData = new FormData()
      formData.append("file", logo)

      const imgResp = await uploadImage(formData)

      const coachInfo: CoachInfo = {
        firstname: coachFName,
        middlename: coachMname,
        lastname: coachLName,
      }

      const teamsData = {
        teamName: name,
        coachInfo: coachInfo,
        teamLogo: imgResp?.url,
        isActive: "1",
        dateCreate: new Date().toString(),
        teamType: GameType.BASKETBALL,
      }

      const resp = await createTeam(teamsData)

      if (!resp) {
        toast.error("Failed to create team")
        return
      }
        
        if (resp.id) {
          setIsDisplayAddPlayer(true)
        }
      

      toast.success("Team created successfully")
    } catch (error) {
      console.log(error)
      toast.error("Failed to create team")
    }
  }
    
    const displayAddPlayer = useMemo(() => {
        if (isDisplayAddPlayer) {
            return <Button>Test</Button>
        }
    
        },[isDisplayAddPlayer])
  return (
    <div className=" flex w-full flex-row gap-5 mt-5">
      <div className=" flex flex-1 flex-col items-center">
        {displayLogo}
        <TextInput
          label="Upload Season Logo"
          type="file"
          className=" text-white"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setLoogo(file)
            }
          }}
        />
      </div>
      <div className=" flex flex-1 flex-col gap-2">
        <TextInput
          label="Team Name"
          type="text"
          value={name}
          className=" text-white"
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
        <p className=" text-[18px] font-semibold">Coach Information</p>
        <TextInput
          label="Coach Firstname"
          type="text"
          value={coachFName}
          className=" text-white"
          onChange={(e) => {
            setCoachFName(e.target.value)
          }}
        />
        <TextInput
          label="Coach Middlename"
          type="text"
          value={coachMname}
          className=" text-white"
          onChange={(e) => {
            setCoachMName(e.target.value)
          }}
        />
        <TextInput
          label="Coach Lastname"
          type="text"
          value={coachLName}
          className=" text-white"
          onChange={(e) => {
            setCoachLName(e.target.value)
          }}
        />
              <div className=" w-full flex flex-1 gap-5 justify-end">
                  {displayAddPlayer}
          <Button onClick={() => handleSubmit()} className=" w-[180px]">
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
