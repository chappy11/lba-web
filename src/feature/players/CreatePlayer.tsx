"use client";

import { Player } from "@/_lib/dto/Player.model";
import { createPlayer } from "@/_lib/server/player";
import { uploadImage } from "@/_lib/server/upload"
import LoadingScreen from "@/components/loading-screen"
import TextInput from "@/components/textinput";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Camera,
  Plus,
  Ruler,
  Save,
  Target,
  Trophy,
  User,
  UserPlus,
  Weight,
} from "lucide-react"
import Image from "next/image"
import { useMemo, useState } from "react"
import { toast } from "sonner";
import Swal from "sweetalert2"

type Props = {
	teamId: string;
};

export enum PlayerType {
  RESERVE = "RESERVE",
  MAIN = "MAIN",
}

export function CreatePlayer(props: Props) {
  const { teamId } = props
  const [firstname, setFirstname] = useState<string>("")
  const [middlename, setMiddlename] = useState<string>("")
  const [lastname, setLastname] = useState<string>("")
  const [position, setPosition] = useState<string>("")
  const [age, setAge] = useState<string>("0")
  const [jerseyNumber, setJerseyNumber] = useState<string>("")
  const [playerType, setPlayerType] = useState<string | null>(null)
  const [height, setHeight] = useState<string>("0")
  const [weight, setWeight] = useState<string>("0")

  const [logo, setLogo] = useState<File | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [firstNameError, setFirstNameError] = useState<string>("")
  const [middleNameError, setMiddleNameError] = useState<string>("")
  const [lastNameError, setLastNameError] = useState<string>("")
  const [positionError, setPositionError] = useState<string>("")
  const [ageError, setAgeError] = useState<string>("")
  const [jerseyNumberError, setJerseyNumberError] = useState<string>("")

  async function handleSubmit() {
    try {
      if (!logo) {
        toast.error("Please upload a player image")
        return
      }

      if (!firstname) {
        setFirstNameError("Please enter a firstname")
        return
      }

      if (!middlename) {
        setMiddleNameError("Please enter a middlename")
        return
      }
      if (!lastname) {
        setLastNameError("Please enter a lastname")
        return
      }

      if (!age) {
        setAgeError("Please enter a age")
        return
      }

      if (!jerseyNumber) {
        setJerseyNumberError("Please enter a jersey number")
        return
      }

      if (!position) {
        setPositionError("Please select a position")
        return
      }
      setIsLoading(true)
      const formData = new FormData()
      formData.append("file", logo)

      const imgResp = await uploadImage(formData)

      const payload: Player = {
        firstname,
        middlename,
        lastname,
        position,
        playerImage: imgResp?.url as string,
        age: parseInt(age),
        jerseyNumber,
        dateCreated: new Date().toISOString(),
        teamId: teamId,
        playerType: playerType as PlayerType,
        height: height,
        weight: weight,
      }

      const response = await createPlayer(payload)

      if (response) {
        Swal.fire({
          icon: "success",
          title: "Player created successfully",
          text: "You have successfully created a new player",
        }).then(() => {
          setIsLoading(false)
          window.location.reload()
        })
      }
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "You cannot create a new player at this moment",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const displayLogo = useMemo(() => {
    if (!logo) {
      return (
        <div className="relative h-32 w-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center group hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Camera className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
          <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-2 shadow-lg">
            <Plus className="w-4 h-4" />
          </div>
        </div>
      )
    }
    const imagePath = URL.createObjectURL(logo)

    return (
      <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
        <Image
          src={imagePath}
          alt="player photo"
          width={128}
          height={128}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </div>
    )
  }, [logo])

  return (
    <Sheet>
      {isLoading && <LoadingScreen />}
      <SheetTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
          <UserPlus className="w-4 h-4 mr-2" />
          Create Player
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[600px] bg-gradient-to-br from-white to-gray-50 p-0">
        <SheetHeader className="space-y-6 p-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <SheetTitle className="text-2xl font-bold text-gray-900">
                Create New Player
              </SheetTitle>
              <SheetDescription className="text-gray-600 mt-2">
                Add a new player to your team roster with complete details
              </SheetDescription>
            </div>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />
        </SheetHeader>

        <div className="px-8 py-8 space-y-10 overflow-auto h-[calc(100vh-250px)]">
          {/* Player Photo Section */}
          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Player Photo
              </h3>
              <p className="text-sm text-gray-600">
                Upload a clear photo of the player
              </p>
            </div>
            {displayLogo}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setLogo(file)
                  }
                }}
              />
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors px-6 py-3"
              >
                <Camera className="w-4 h-4 mr-2" />
                {logo ? "Change Photo" : "Upload Photo"}
              </Button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <TextInput
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                label="First Name"
                error={firstNameError}
                className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <TextInput
                value={middlename}
                onChange={(e) => setMiddlename(e.target.value)}
                label="Middle Name"
                error={middleNameError}
                className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <TextInput
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                label="Last Name"
                error={lastNameError}
                className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <TextInput
                label="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                error={ageError}
                type="number"
                className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Player Details */}
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Player Details
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <TextInput
                label="Jersey Number"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(e.target.value)}
                error={jerseyNumberError}
                type="number"
                className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  Position
                </label>
                <Select onValueChange={(e) => setPosition(e)} value={position}>
                  <SelectTrigger className="w-full bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-11">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PG">Point Guard (PG)</SelectItem>
                    <SelectItem value="SG">Shooting Guard (SG)</SelectItem>
                    <SelectItem value="SF">Small Forward (SF)</SelectItem>
                    <SelectItem value="PF">Power Forward (PF)</SelectItem>
                    <SelectItem value="C">Center (C)</SelectItem>
                  </SelectContent>
                </Select>
                {positionError && (
                  <p className="text-red-500 text-sm">{positionError}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Player Type
              </label>
              <Select
                onValueChange={(e) => setPlayerType(e)}
                value={playerType || ""}
              >
                <SelectTrigger className="w-full bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-11">
                  <SelectValue placeholder="Select Player Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PlayerType.MAIN}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Main Player
                    </div>
                  </SelectItem>
                  <SelectItem value={PlayerType.RESERVE}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      Reserve Player
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Physical Stats */}
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-3 mb-6">
              <Ruler className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Physical Stats
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-blue-600" />
                  Height (cm)
                </label>
                <TextInput
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 185"
                  type="number"
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Weight className="w-4 h-4 text-blue-600" />
                  Weight (kg)
                </label>
                <TextInput
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 75"
                  type="number"
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t border-gray-200 p-8 mt-4">
          <div className="flex gap-4 w-full">
            <SheetClose asChild>
              <Button variant="outline" className="flex-1 h-12">
                Cancel
              </Button>
            </SheetClose>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Creating..." : "Create Player"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
