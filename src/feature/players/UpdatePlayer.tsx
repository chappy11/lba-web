"use client"

import { Player } from "@/_lib/dto/Player.model"
import { updatePlayerById } from "@/_lib/server/player"
import { uploadImage } from "@/_lib/server/upload"
import TextInput from "@/components/textinput"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Camera, Edit, Loader2, Upload } from "lucide-react"
import Image from "next/image"
import { useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { PlayerType } from "./CreatePlayer"

type Props = {
    player: Player
    buttonType: unknown;
}

export default function UpdatePlayer(props: Props) {
    const { player, buttonType = 'outline'} = props
  const [playerImage, setPlayerImage] = useState<File | null>(null)
  const [firstname, setFirstname] = useState(player.firstname)
  const [middlename, setMiddlename] = useState(player.middlename)
  const [lastname, setLastname] = useState(player.lastname)
  const [position, setPosition] = useState(player.position)
  const [age, setAge] = useState(player.age.toString())
  const [jerseyNumber, setJerseyNumber] = useState(player.jerseyNumber)
  const [playerType, setPlayerType] = useState<string>(player.playerType)
  const [height, setHeight] = useState(player.height)
  const [weight, setWeight] = useState(player.weight)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayPlayerImage = useMemo(() => {
    if (playerImage) {
      const imagePath = URL.createObjectURL(playerImage)
      return (
        <div className=" h-[200px] w-[200px] border ">
          <Image
            src={imagePath}
            alt="New player photo"
            width={200}
            height={200}
            className="object-cover pointer-events-none"
          />
        </div>
      )
    }

    if (player.playerImage) {
      return (
        <div className="relative group">
          <div className="relative h-40 w-40 rounded-2xl overflow-hidden border-4 border-gray-300 shadow-xl ring-4 ring-gray-100 group-hover:ring-blue-100 transition-all">
            <Image
              src={player.playerImage}
              fill
              alt={`${player.firstname} ${player.lastname}`}
              className="object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center pointer-events-none">
              <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-1 rounded-full shadow-lg pointer-events-none">
            Current Photo
          </div>
        </div>
      )
    }

    return (
      <div className="relative group">
        <div className="h-40 w-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex flex-col items-center justify-center border-4 border-dashed border-blue-300 group-hover:border-blue-500 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all cursor-pointer">
          <Upload className="w-12 h-12 text-blue-400 group-hover:text-blue-600 transition-colors mb-2 pointer-events-none" />
          <p className="text-sm text-blue-600 font-medium pointer-events-none">
            Upload Photo
          </p>
        </div>
      </div>
    )
  }, [playerImage, player.playerImage, player.firstname, player.lastname])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file")
        return
      }
      setPlayerImage(file)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)

      if (!firstname.trim() || !lastname.trim()) {
        toast.error("First and last name are required")
        return
      }

      if (!position) {
        toast.error("Position is required")
        return
      }

      if (!age || parseInt(age) <= 0) {
        toast.error("Valid age is required")
        return
      }

      if (!jerseyNumber.trim()) {
        toast.error("Jersey number is required")
        return
      }

      let imageUrl = player.playerImage

      // Upload new image if selected
      if (playerImage) {
        const formData = new FormData()
        formData.append("file", playerImage)

        const uploadResponse = await uploadImage(formData)

        if (!uploadResponse.url) {
          toast.error("Failed to upload player photo")
          return
        }

        imageUrl = uploadResponse.url
      }

      const updatePayload = {
        teamId: player.teamId,
        firstname: firstname.trim(),
        middlename: middlename.trim(),
        lastname: lastname.trim(),
        position: position,
        age: parseInt(age),
        jerseyNumber: jerseyNumber.trim(),
        dateCreated: player.dateCreated,
        playerImage: imageUrl,
        playerType: playerType as PlayerType,
        height: height,
        weight: weight,
      }

      const response = await updatePlayerById(player.id!, updatePayload)

      if (response.success) {
        toast.success("Player updated successfully!")
      } else {
        toast.error(response.message || "Failed to update player")
      }

      // Refresh page
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error("Error updating player:", error)
      toast.error("An error occurred while updating the player")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={buttonType} className="gap-2">
          <Edit className="w-4 h-4" />
          Edit Player Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Edit Player Profile
          </DialogTitle>
          <DialogDescription>
            Update player information and profile picture. Changes will be saved
            immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer"
            >
              {displayPlayerImage}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-gray-700">
                Player Profile Picture
              </p>
              <p className="text-xs text-gray-500">
                Click to upload • Max 5MB • JPG, PNG, GIF
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="border-blue-300 hover:bg-blue-50"
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-xs">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <TextInput
                    id="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="First name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middlename" className="text-xs">
                    Middle Name
                  </Label>
                  <TextInput
                    id="middlename"
                    value={middlename}
                    onChange={(e) => setMiddlename(e.target.value)}
                    placeholder="Middle name (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-xs">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <TextInput
                    id="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>

            {/* Player Details */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                Player Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-xs">
                    Position <span className="text-red-500">*</span>
                  </Label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jerseyNumber" className="text-xs">
                    Jersey Number <span className="text-red-500">*</span>
                  </Label>
                  <TextInput
                    id="jerseyNumber"
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(e.target.value)}
                    placeholder="e.g., 23"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-xs">
                    Age <span className="text-red-500">*</span>
                  </Label>
                  <TextInput
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="playerType" className="text-xs">
                    Player Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={playerType} onValueChange={setPlayerType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PlayerType.MAIN}>
                        Main Player
                      </SelectItem>
                      <SelectItem value={PlayerType.RESERVE}>
                        Reserve Player
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Physical Attributes */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                Physical Attributes
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-xs">
                    Height (cm)
                  </Label>
                  <TextInput
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 185"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-xs">
                    Weight (kg)
                  </Label>
                  <TextInput
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g., 75"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-5">
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
