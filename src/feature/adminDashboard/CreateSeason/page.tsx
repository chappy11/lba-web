"use client"

import { SeasonInsertPayload } from "@/_lib/dto/Season.model"
import { GameType } from "@/_lib/enums/GameTypeEnum"
import { createSeason } from "@/_lib/server/season"
import { uploadImage } from "@/_lib/server/upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@radix-ui/react-label"
import { useMemo, useState } from "react"
import { toast } from "sonner"
export default function CreateSeason() {
  const [image, setImage] = useState<File | null>(null);
  const [seasonName, setSeasonName] = useState<string>("");
  const [seasonMotto, setSeasonMotto] = useState<string>("");
  const [seasonStartDate, setSeasonStartDate] = useState<string>("");
  const [seasonEndDate, setSeasonEndDate] = useState<string>("");
  const [gameType, setGameType] = useState<string>("");

  const displayImage = useMemo(() => {
    if (!image) {
      return <div className=" h-[100px] w-[100px] bg-gray-500 rounded-full" />
    }
    const imagePath = URL.createObjectURL(image);

    return <img src={imagePath} height={100} width={100} alt="season photo" />
  }, [image])
  
  async function handleSubmit() {
    try {
      if (!image) {
        toast.error("Please upload a season logo")
        return
      }

      if (!seasonName) {
        toast.error("Please enter a season name")
        return
      }
      if (!seasonMotto) {
        toast.error("Please enter a season motto")
        return
      }
      if (!seasonStartDate) {
        toast.error("Please enter a season start date")
        return
      }
      if (!seasonEndDate) {
        toast.error("Please enter a season end date")
        return
      }
      if (!gameType) {
        toast.error("Please select a game type")
        return
      }
      if (new Date(seasonStartDate) > new Date(seasonEndDate)) {
        toast.error("Season start date cannot be after end date")
        return
      }
      const formData = new FormData()
      formData.append("file", image)

      const responseImage = await uploadImage(formData)

      const imagePath = responseImage?.url
      if (!imagePath) {
        toast.error("Failed to upload image")
        return
      }

      const payload: SeasonInsertPayload = {
        seasonName: seasonName,
        isActiveSeason: 1,
        seasonStartDate,
        seasonEndDate,
        dateCreated: new Date().toISOString(),
        gameType: gameType as GameType,
        seasonLogo: imagePath,
        gameWinner: null,
        mvpOfTheSeason: null,
        seasonMotto,
      }

      const resp = await createSeason(payload)

      if (resp) {
        toast.success("Season created successfully");
        setImage(null)
        setSeasonName("")
        setSeasonMotto("")
        setSeasonStartDate("")
        setSeasonEndDate("")
        setGameType("")
        return 
      }

      toast.error("Failed to create season")
   } catch (error) {
     console.log("test", error)
     toast.error("Failed to create season")
   }
    

  }

  return (
    <Sheet>
      <SheetTrigger className=" bg-amber-800 text-white px-3 rounded-md py-2">
        Create New Season
      </SheetTrigger>
      <SheetContent className=" bg-neutral-800">
        <SheetHeader>
          <SheetTitle className=" text-neutral-100">Create Season</SheetTitle>
        </SheetHeader>
        <div className=" flex flex-col gap-5 px-3">
          <div className=" flex w-full items-center justify-center">
            {displayImage}
          </div>
          <Input
            inputLabel="Upload Season Logo"
            type="file"
            className=" text-white"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setImage(file)
              }
            }}
          />
          <Input
            inputLabel="Season Name"
            placeholder=" Enter the season name"
            value={seasonName}
            onChange={(e) => setSeasonName(e.target.value)}
          />
          <Textarea
            inputLabel="Season Motto"
            value={seasonMotto}
            onChange={(e) => setSeasonMotto(e.target.value)}
          />
          <Input
            type="date"
            inputLabel="Season Start Date"
            value={seasonStartDate}
            onChange={(e) => setSeasonStartDate(e.target.value)}
            placeholder=" Enter the season name"
          />
          <Input
            type="date"
            inputLabel="Season Season End Date"
            value={seasonEndDate}
            onChange={(e) => setSeasonEndDate(e.target.value)}
            placeholder=" Enter the season name"
          />
          <div className=" flex flex-col gap-1">
            <Label className=" text-white">Game Type</Label>
            <Select onValueChange={(e)=>setGameType(e)} value={gameType}>
              <SelectTrigger className="w-full text-white">
                <SelectValue
                  className=" text-white"
                  placeholder="Select Game Type"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GameType.BASKETBALL}>Basketball</SelectItem>
                <SelectItem value={GameType.VOLLEYBALL}>Volleyball</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className=" bg-amber-600" onClick={()=>handleSubmit()}>Submit</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
