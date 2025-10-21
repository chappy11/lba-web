"use client";
import { MatchType, SeasonInsertPayload } from "@/_lib/dto/Season.model"
import { GameType } from "@/_lib/enums/GameTypeEnum";
import { createSeason } from "@/_lib/server/season";
import { uploadImage } from "@/_lib/server/upload";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Trophy, Users, Image as ImageIcon, FileText, Target, Upload, Save, Plus } from "lucide-react"
import Image from "next/image"
import { useMemo, useState } from "react"
import { toast } from "sonner";

export default function CreateSeason() {
	const [image, setImage] =
		useState<File | null>(null);
	const [seasonName, setSeasonName] =
		useState<string>("");
	const [seasonMotto, setSeasonMotto] =
		useState<string>("");
	const [
		seasonStartDate,
		setSeasonStartDate,
	] = useState<string>("");
	const [
		seasonEndDate,
		setSeasonEndDate,
	] = useState<string>("");
	const [matchType, setMatchType] = useState<MatchType | "">("")
  const [numberOfTeams, setNumberOfTeams] = useState<string>("")

  const displayImage = useMemo(() => {
    if (!image) {
      return (
        <div className="relative h-32 w-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center group hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
          <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-2 shadow-lg">
            <Plus className="w-4 h-4" />
          </div>
        </div>
      )
    }
    const imagePath = URL.createObjectURL(image)

    return (
      <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
        <Image
          src={imagePath}
          alt="season logo"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Upload className="w-6 h-6 text-white" />
        </div>
      </div>
    )
  }, [image])

  // Validate if number is power of 2
  const isPowerOfTwo = (num: number): boolean => {
    return num > 0 && (num & (num - 1)) === 0
  }

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
      if (!matchType) {
        toast.error("Please select a match type")
        return
      }
      if (!numberOfTeams) {
        toast.error("Please enter number of teams")
        return
      }

      const teamsNum = parseInt(numberOfTeams)

      if (isNaN(teamsNum) || teamsNum < 2) {
        toast.error("Number of teams must be at least 2")
        return
      }

      if (teamsNum % 2 !== 0) {
        toast.error("Number of teams must be even")
        return
      }

      if (matchType === MatchType.ELIMINATION && !isPowerOfTwo(teamsNum)) {
        toast.error(
          "For elimination matches, number of teams must be a power of 2 (2, 4, 8, 16, 32, etc.)"
        )
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
        gameType: GameType.BASKETBALL,
        seasonLogo: imagePath,
        gameWinner: null,
        mvpOfTheSeason: null,
        seasonMotto,
        matchType: matchType,
        numberOfTeams: teamsNum,
      }

      const resp = await createSeason(payload)

      if (resp) {
        toast.success("Season created successfully")
        setImage(null)
        setSeasonName("")
        setSeasonMotto("")
        setSeasonStartDate("")
        setSeasonEndDate("")
        setMatchType("")
        setNumberOfTeams("")
        return
      }

      toast.error("Failed to create season")
    } catch (error) {
      console.log("test", error)
      toast.error("Failed to create season")
    }
  }

	return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold text-gray-900">Create New Season</h1>
              <p className="text-gray-600 text-lg mt-2">Set up a new basketball season with teams and match schedule</p>
            </div>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mt-6" />
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="grid md:grid-cols-3 gap-0">
            {/* Left Panel - Image Upload */}
            <div className="md:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col items-center justify-center gap-6 border-r border-gray-200">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Season Logo</h3>
                <p className="text-sm text-gray-600">Upload an image for your season</p>
              </div>

              {/* Image Preview */}
              <div className="relative group">
                {displayImage}
              </div>

              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setImage(e?.target?.files?.[0] as File)
                  }
                />
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors px-6 py-3"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {image ? "Change Logo" : "Upload Logo"}
                </Button>
              </div>
            </div>

            {/* Right Panel - Form Fields */}
            <div className="md:col-span-2 p-8">
              <div className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <Trophy className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Basic Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-blue-600" />
                        Season Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Championship 2025"
                        value={seasonName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSeasonName(e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        Season Motto / Description
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Play Hard, Win Together"
                        value={seasonMotto}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSeasonMotto(e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Season Schedule
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={seasonStartDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSeasonStartDate(e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        End Date
                      </label>
                      <input
                        type="date"
                        value={seasonEndDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSeasonEndDate(e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Match Configuration */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Match Configuration
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-600" />
                        Match Type
                      </label>
                      <Select
                        value={matchType}
                        onValueChange={(value: string) =>
                          setMatchType(value as MatchType)
                        }
                      >
                        <SelectTrigger className="w-full bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-11">
                          <SelectValue placeholder="Select match type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={MatchType.ROUND_ROBIN}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              Round Robin
                            </div>
                          </SelectItem>
                          <SelectItem value={MatchType.ELIMINATION}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                              Elimination Tournament
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-2">
                        {matchType === MatchType.ELIMINATION
                          ? "⚡ Elimination: Teams compete in knockout rounds (requires power of 2 teams)"
                          : matchType === MatchType.ROUND_ROBIN
                          ? "🔄 Round Robin: Every team plays against every other team"
                          : "💡 Choose how teams will compete in the season"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Users className="w-4 h-4 text-pink-600" />
                        Number of Teams
                      </label>
                      <input
                        type="number"
                        placeholder="Enter number of teams"
                        value={numberOfTeams}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNumberOfTeams(e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      />
                      {numberOfTeams && (
                        <div
                          className={`mt-2 p-3 rounded-lg border ${
                            parseInt(numberOfTeams) % 2 !== 0
                              ? "bg-red-50 border-red-200"
                              : matchType === MatchType.ELIMINATION &&
                                !isPowerOfTwo(parseInt(numberOfTeams))
                              ? "bg-yellow-50 border-yellow-200"
                              : "bg-green-50 border-green-200"
                          }`}
                        >
                          <p
                            className={`text-sm flex items-center gap-2 ${
                              parseInt(numberOfTeams) % 2 !== 0
                                ? "text-red-600"
                                : matchType === MatchType.ELIMINATION &&
                                  !isPowerOfTwo(parseInt(numberOfTeams))
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {parseInt(numberOfTeams) % 2 !== 0 ? (
                              <>⚠️ Number must be even</>
                            ) : matchType === MatchType.ELIMINATION &&
                              !isPowerOfTwo(parseInt(numberOfTeams)) ? (
                              <>
                                ⚠️ For elimination, must be power of 2 (2, 4, 8, 16,
                                32, etc.)
                              </>
                            ) : (
                              <>✓ Valid number of teams</>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleSubmit}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-lg font-semibold"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Create Season
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-gray-900 font-semibold">Season Setup</h3>
            </div>
            <p className="text-sm text-gray-600">Configure basic season information and dates</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-gray-900 font-semibold">Match Format</h3>
            </div>
            <p className="text-sm text-gray-600">Choose between round robin or elimination format</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-gray-900 font-semibold">Team Limit</h3>
            </div>
            <p className="text-sm text-gray-600">Set maximum number of teams for the season</p>
          </div>
        </div>
      </div>
    </div>
  )
}
