"use client"

import { Team } from "@/_lib/dto/Team.model"
import { updateTeamById } from "@/_lib/server/team"
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
import { Camera, Loader2, Upload } from "lucide-react"
import Image from "next/image"
import { useMemo, useRef, useState } from "react"
import { toast } from "sonner"

type Props = {
  team: Team
}

export default function EditTeam(props: Props) {
  const { team } = props
  const [logo, setLogo] = useState<File | null>(null)
  const [teamName, setTeamName] = useState(team.teamName)
  const [coachFirstName, setCoachFirstName] = useState(team.coachInfo.firstname)
  const [coachMiddleName, setCoachMiddleName] = useState(
    team.coachInfo.middlename
  )
  const [coachLastName, setCoachLastName] = useState(team.coachInfo.lastname)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayLogo = useMemo(() => {
    if (logo) {
      const imagePath = URL.createObjectURL(logo)
      return (
        <div className=" h-[200px] w-[200px] border ">
          <Image
            src={imagePath}
            alt="New team logo"
            width={200}
            height={200}
            className="object-cover pointer-events-none"
          />
        </div>
      )
    }

    if (team.teamLogo) {
      return (
        <div className="relative group">
          <div className="relative h-40 w-40 rounded-2xl overflow-hidden border-4 border-gray-300 shadow-xl ring-4 ring-gray-100 group-hover:ring-purple-100 transition-all">
            <Image
              src={team.teamLogo}
              fill
              alt={team.teamName}
              className="object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center pointer-events-none">
              <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-1 rounded-full shadow-lg pointer-events-none">
            Current Logo
          </div>
        </div>
      )
    }

    return (
      <div className="relative group">
        <div className="h-40 w-40 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex flex-col items-center justify-center border-4 border-dashed border-purple-300 group-hover:border-purple-500 group-hover:from-purple-200 group-hover:to-indigo-200 transition-all cursor-pointer">
          <Upload className="w-12 h-12 text-purple-400 group-hover:text-purple-600 transition-colors mb-2 pointer-events-none" />
          <p className="text-sm text-purple-600 font-medium pointer-events-none">
            Upload Logo
          </p>
        </div>
      </div>
    )
  }, [logo, team.teamLogo, team.teamName])

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
      setLogo(file)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)

      if (!teamName.trim()) {
        toast.error("Team name is required")
        return
      }

      if (!coachFirstName.trim() || !coachLastName.trim()) {
        toast.error("Coach first and last name are required")
        return
      }

      let logoUrl = team.teamLogo

      // Upload new logo if selected
      if (logo) {
        const formData = new FormData()
        formData.append("file", logo)

        const uploadResponse = await uploadImage(formData)

        console.log("Upload Response:", uploadResponse)

        if (!uploadResponse.url) {
          toast.error("Failed to upload team logo")
          return
        }

        logoUrl = uploadResponse.url
      }

      const updatePayload = {
        seasonId: team.seasonId,
        teamName: teamName.trim(),
        coachInfo: {
          firstname: coachFirstName.trim(),
          middlename: coachMiddleName.trim(),
          lastname: coachLastName.trim(),
        },
        teamLogo: logoUrl,
        isActive: team.isActive,
        dateCreate: team.dateCreate,
        teamType: team.teamType,
        featurePlayer: team.featurePlayer,
      }

      const response = await updateTeamById(team.id!, updatePayload)

      if (response.success) {
        toast.success("Team updated successfully!")
      } else {
        toast.error(response.message || "Failed to update team")
      }
    } catch (error) {
      console.error("Error updating team:", error)
      toast.error("An error occurred while updating the team")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Team Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Edit Team Profile
          </DialogTitle>
          <DialogDescription>
            Update team information and profile picture. Changes will be saved
            immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-100">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer"
            >
              {displayLogo}
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
                Team Profile Picture
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
              className="border-purple-300 hover:bg-purple-50"
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </div>

          {/* Team Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName" className="text-sm font-semibold">
                Team Name <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                className="h-11"
              />
            </div>

            {/* Coach Information */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full" />
                Coach Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coachFirstName" className="text-xs">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <TextInput
                    id="coachFirstName"
                    value={coachFirstName}
                    onChange={(e) => setCoachFirstName(e.target.value)}
                    placeholder="First name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coachMiddleName" className="text-xs">
                    Middle Name
                  </Label>
                  <TextInput
                    id="coachMiddleName"
                    value={coachMiddleName}
                    onChange={(e) => setCoachMiddleName(e.target.value)}
                    placeholder="Middle name (optional)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coachLastName" className="text-xs">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="coachLastName"
                  value={coachLastName}
                  onChange={(e) => setCoachLastName(e.target.value)}
                  placeholder="Last name"
                />
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
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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