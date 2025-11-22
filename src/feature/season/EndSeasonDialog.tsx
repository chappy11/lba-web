"use client"

import { Season } from "@/_lib/dto/Season.model"
import { updateSeasonWithMvp } from "@/_lib/services/SeasonService.service"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Trophy, XCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  season: Season
  onSuccess?: () => void
}

export default function EndSeasonDialog({ season, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [calculateMvp, setCalculateMvp] = useState(true)

  const handleEndSeason = async () => {
    try {
      setIsLoading(true)

      if (!season.id) {
        toast.error("Season ID not found")
        return
      }

      if (calculateMvp) {
        // Calculate and set MVP, then mark season as complete
        const result = await updateSeasonWithMvp(season.id)
        
        toast.success("Season completed with MVP!", {
          description: `${result.mvp.firstname} ${result.mvp.lastname} is the MVP with ${result.score} points!`,
        })
      } else {
        // Just mark season as complete without MVP calculation
        const { updateSeason } = await import("@/_lib/services/SeasonService.service")
        await updateSeason(season.id, { isActiveSeason: 0 })
        
        toast.success("Season marked as complete!", {
          description: `${season.seasonName} has been successfully ended.`,
        })
      }

      setOpen(false)
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }

      // Refresh page to show updated data
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error("Error ending season:", error)
      toast.error("Failed to end season", {
        description: error instanceof Error ? error.message : "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isActiveSeason = season.isActiveSeason === 1

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant={isActiveSeason ? "ghost" : "outline"}
        size="sm"
        onClick={() => setOpen(true)}
        disabled={!isActiveSeason}
        className={!isActiveSeason ? "opacity-50 cursor-not-allowed" : ""}
      >
        {isActiveSeason ? "End Season" : "Completed"}
      </Button>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-full">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl">Complete This Season?</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            You are about to mark <strong>{season.seasonName}</strong> as complete.
          </DialogDescription>
        </DialogHeader>

        {/* Warning Box */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 my-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-2">
                Important Notice
              </h4>
              <p className="text-sm text-amber-800 mb-3">
                Once marked as done, this season will no longer be active.
              </p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-900">This action will:</p>
                <ul className="space-y-1.5 text-sm text-amber-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Set the season status to &quot;Done&quot;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Deactivate the season</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Archive all season data for records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" />
                    <span className="text-red-800">Prevent further match updates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Season Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-gray-900 mb-3">Season Details</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Season Name:</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">{season.seasonName}</span>
            </div>
            
            <div>
              <span className="text-gray-600">Start Date:</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">
                {new Date(season.seasonStartDate).toLocaleDateString()}
              </span>
            </div>
            
            <div>
              <span className="text-gray-600">End Date:</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">
                {new Date(season.seasonEndDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* MVP Calculation Option */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="calculateMvp"
              checked={calculateMvp}
              onChange={(e) => setCalculateMvp(e.target.checked)}
              className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="calculateMvp" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-purple-900">Calculate MVP of the Season</span>
              </div>
              <p className="text-sm text-purple-800">
                Automatically determine the Most Valuable Player based on performance stats.
              </p>
              <p className="text-xs text-purple-700 mt-2">
                <strong>Formula:</strong> (Points + 3-Pointers + Assists + Steals + Rebounds) - (Fouls + Turnovers)
              </p>
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEndSeason}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Completing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Yes, Complete Season
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
