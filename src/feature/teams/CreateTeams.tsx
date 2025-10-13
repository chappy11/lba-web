"use client"

import { CoachInfo } from "@/_lib/dto/Team.model"
import { GameType } from "@/_lib/enums/GameTypeEnum"
import { createTeam } from "@/_lib/server/team"
import { uploadImage } from "@/_lib/server/upload"
import LoadingScreen from "@/components/loading-screen"
import TextInput from "@/components/textinput"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import Swal from "sweetalert2"

export default function CreateTeam() {
  const [logo, setLoogo] = useState<File | null>(null)

  const [name, setName] = useState<string>("")
  const [coachFName, setCoachFName] = useState<string>("")
  const [coachMname, setCoachMName] = useState<string>("")
  const [coachLName, setCoachLName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [isDisplayAddPlayer, setIsDisplayAddPlayer] = useState<boolean>(false)

  const displayLogo = useMemo(() => {
    if (!logo) {
      return (
        <div className="relative group">
          <div className="h-32 w-32 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center border-4 border-dashed border-purple-300 group-hover:border-purple-500 transition-all">
            <svg
              className="w-12 h-12 text-purple-400 group-hover:text-purple-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-2 shadow-lg">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </div>
      )
    }
    const imagePath = URL.createObjectURL(logo)

    return (
      <div className="relative group">
        <img
          src={imagePath}
          height={128}
          width={128}
          alt="team logo"
          className="h-32 w-32 rounded-full object-cover border-4 border-purple-500 shadow-xl ring-4 ring-purple-100 group-hover:ring-purple-200 transition-all"
        />
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-2 shadow-lg">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
    )
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
      setIsLoading(true)

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
        featurePlayer: null,
      }

      const resp = await createTeam(teamsData)

      if (!resp) {
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: "You cannot create a new team at this moment",
        })
        return
      }

      if (resp.id) {
        setIsDisplayAddPlayer(true)
      }
      setIsLoading(false)
      Swal.fire({
        icon: "success",
        title: "Team created successfully",
        showConfirmButton: false,
      }).then(() => {
        window.location.reload()
      })
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "You cannot create a new team at this moment",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const displayAddPlayer = useMemo(() => {
    if (isDisplayAddPlayer) {
      return <Button>Test</Button>
    }
  }, [isDisplayAddPlayer])
  return (
    <div className="flex w-full flex-col lg:flex-row">
      {isLoading && <LoadingScreen />}

      {/* Left Side - Image with Overlay */}
      <div className="relative lg:w-2/5 hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-indigo-700/90 z-10" />
        <Image
          src={"/team.jpg"}
          width={400}
          height={600}
          className="object-cover h-full w-full"
          priority
          alt="Team Image"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <svg
              className="w-20 h-20 mb-4 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-3xl font-bold text-center mb-2">
              Build Your Team
            </h2>
            <p className="text-center text-white/90 text-sm">
              Create a new team and start your basketball journey
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-white">
        <div className="p-8 lg:p-12 max-w-2xl mx-auto">
          {/* Team Logo Upload Section */}
          <div className="mb-10">
            <div className="flex flex-col items-center justify-center mb-8">
              {displayLogo}
              <label className="mt-4 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setLoogo(file)
                    }
                  }}
                />
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:from-purple-600 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Upload Team Logo
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/* Team Information Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full" />
              <h3 className="text-xl font-bold text-gray-900">
                Team Information
              </h3>
            </div>
            <div className="space-y-4">
              <TextInput
                label="Team Name"
                type="text"
                value={name}
                className="text-white"
                onChange={(e) => {
                  setName(e.target.value)
                }}
              />
            </div>
          </div>

          {/* Coach Information Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full" />
              <h3 className="text-xl font-bold text-gray-900">
                Coach Information
              </h3>
            </div>
            <div className="space-y-4">
              <TextInput
                label="Coach First Name"
                type="text"
                value={coachFName}
                className="text-white"
                onChange={(e) => {
                  setCoachFName(e.target.value)
                }}
              />
              <TextInput
                label="Coach Middle Name"
                type="text"
                value={coachMname}
                className="text-white"
                onChange={(e) => {
                  setCoachMName(e.target.value)
                }}
              />
              <TextInput
                label="Coach Last Name"
                type="text"
                value={coachLName}
                className="text-white"
                onChange={(e) => {
                  setCoachLName(e.target.value)
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
            {displayAddPlayer}
            <Button
              onClick={() => handleSubmit()}
              size="lg"
              className="w-full sm:w-auto min-w-[200px]"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Create Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
