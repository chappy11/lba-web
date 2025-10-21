"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Loader2, Trophy, Users } from "lucide-react"
import { useState } from "react"

export default function Page() {
  const [isCreating, setIsCreating] = useState(false)
  const [creationStatus, setCreationStatus] = useState<string | null>(null)

  const create10TeamMatches = async () => {
    setIsCreating(true)
    setCreationStatus(null)

    try {
      // Call the API to create TBA elimination matches
      const response = await fetch('/api/create-elimination-matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const result = await response.json()
        setCreationStatus(`✅ Successfully created ${result.totalMatches} matches across ${result.totalRounds} rounds! All teams set to TBA. Redirecting to bracket view...`)
        
        // Redirect to bracket view after successful creation
        setTimeout(() => {
          window.location.href = '/administrator/match-schedule'
        }, 2000)
      } else {
        const error = await response.json()
        setCreationStatus(`❌ Failed to create matches: ${error.message}`)
      }
    } catch (error) {
      console.error('Error creating matches:', error)
      setCreationStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Match Settings</h1>
        <p className="text-gray-600">Configure and create match tournaments.</p>
      </div>

      <div className="grid gap-6">
        {/* 10 Team Tournament Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              10 Team Elimination Tournament
            </h2>
            <p className="text-gray-600">
              Create a complete elimination tournament structure with all teams
              set to &quot;TBA&quot; for later assignment.
            </p>
          </div>

          <div className="space-y-4">
            {/* Tournament Structure Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                Tournament Structure:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-100 border border-blue-300 rounded text-xs">
                    Round 1
                  </span>
                  <span className="text-sm text-blue-700">
                    5 matches (10 → 5 teams)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-purple-100 border border-purple-300 rounded text-xs">
                    Round 2
                  </span>
                  <span className="text-sm text-purple-700">
                    2 matches + 1 bye (5 → 3 teams)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-yellow-100 border border-yellow-300 rounded text-xs">
                    Round 3
                  </span>
                  <span className="text-sm text-yellow-700">
                    1 final match (3 → 1 winner)
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-green-500 mt-1" />
                <div>
                  <p className="font-medium text-sm">Empty Match Structure</p>
                  <p className="text-xs text-gray-600">
                    All teams set to &quot;TBA&quot; for future assignment
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-blue-500 mt-1" />
                <div>
                  <p className="font-medium text-sm">Flexible Scheduling</p>
                  <p className="text-xs text-gray-600">
                    Dates and times can be set later
                  </p>
                </div>
              </div>
            </div>

            {/* Status Message */}
            {creationStatus && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  creationStatus.includes("✅")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {creationStatus}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={create10TeamMatches}
                disabled={isCreating}
                className="flex-1 md:flex-initial"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Tournament...
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4 mr-2" />
                    Create TBA Tournament (10 Teams)
                  </>
                )}
              </Button>

              <Button
                onClick={() =>
                  (window.location.href =
                    "/administrator/match-schedule/team-assignment")
                }
                variant="outline"
                className="flex-1 md:flex-initial"
              >
                <Users className="w-4 h-4 mr-2" />
                Assign Teams to Matches
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold mb-4">How It Works</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">1.</span>
              <p>
                Creates 8 total matches across 3 rounds with proper elimination
                structure
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">2.</span>
              <p>
                Use the &quot;Assign Teams to Matches&quot; button to assign
                real teams to Round 1 matches
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">3.</span>
              <p>
                Round 2 &amp; 3: Teams marked as &quot;TBA&quot; until winners
                advance
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">4.</span>
              <p>
                All match dates, times, and venues can be configured separately
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}