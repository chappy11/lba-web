"use client"

import { saveTeamAssignmentsAction } from "@/app/(admin2)/administrator/match-schedule/team-assignment/actions"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Save, Trophy, Users } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

interface Team {
  id: string
  teamName: string
  teamLogo: string
}

interface Match {
  id: string
  team1: string
  team2: string
  team1Id: string
  team2Id: string
  matchType: string
  round?: number
}

interface Round {
  round: number
  matches: Match[]
}

interface TournamentData {
  id: string
  matchSchedule: Round[]
}

interface ServerResponse<T> {
  success: boolean
  data: T
  message: string
}

interface TeamSelectionSheetProps {
  initialTournamentData?: ServerResponse<TournamentData>
  initialTeamsData?: ServerResponse<Team[]>
}

export default function TeamSelectionSheet({ 
  initialTournamentData, 
  initialTeamsData 
}: TeamSelectionSheetProps) {
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(null)
  const [availableTeams, setAvailableTeams] = useState<Team[]>([])
  const [selectedTeams, setSelectedTeams] = useState<{[matchId: string]: {team1?: string, team2?: string}}>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string>("")

  const initializeWithServerData = useCallback(() => {
    try {
      setLoading(true)

      // Use server-fetched tournament data
      if (initialTournamentData?.success && initialTournamentData?.data) {
        setTournamentData(initialTournamentData.data)
        
        // Initialize selected teams state
        const initialSelections: {[matchId: string]: {team1?: string, team2?: string}} = {}
        initialTournamentData.data.matchSchedule.forEach((round: Round) => {
          round.matches.forEach((match: Match) => {
            initialSelections[match.id] = {
              team1: match.team1 !== "TBA" ? match.team1Id : undefined,
              team2: match.team2 !== "TBA" ? match.team2Id : undefined
            }
          })
        })
        setSelectedTeams(initialSelections)
      }
      
      // Use server-fetched teams data
      if (initialTeamsData?.success && initialTeamsData?.data) {
        setAvailableTeams(initialTeamsData.data)
      }
      
    } catch (error) {
      console.error('Error initializing with server data:', error)
      setMessage("❌ Failed to load tournament data")
    } finally {
      setLoading(false)
    }
  }, [initialTournamentData, initialTeamsData])

  useEffect(() => {
    // Use server-side data if available, otherwise fetch from client
    if (initialTournamentData && initialTeamsData) {
      initializeWithServerData()
    } else {
      loadData()
    }
  }, [initialTournamentData, initialTeamsData, initializeWithServerData])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Fallback to client-side API calls when server data is not available
      console.log('Loading data from client-side APIs...')
      
      // Load elimination tournament data
      const tournamentResponse = await fetch('/api/get-elimination-matches')
      const tournamentData = await tournamentResponse.json()
      
      // Load available teams
      const teamsResponse = await fetch('/api/teams')
      const teamsData = await teamsResponse.json()
      
      if (tournamentData.success && tournamentData.data) {
        setTournamentData(tournamentData.data)
        
        // Initialize selected teams state
        const initialSelections: {[matchId: string]: {team1?: string, team2?: string}} = {}
        tournamentData.data.matchSchedule.forEach((round: Round) => {
          round.matches.forEach((match: Match) => {
            initialSelections[match.id] = {
              team1: match.team1 !== "TBA" ? match.team1Id : undefined,
              team2: match.team2 !== "TBA" ? match.team2Id : undefined
            }
          })
        })
        setSelectedTeams(initialSelections)
      }
      
      if (teamsData.success && teamsData.data) {
        setAvailableTeams(teamsData.data)
      }
      
    } catch (error) {
      console.error('Error loading data:', error)
      setMessage("❌ Failed to load tournament data")
    } finally {
      setLoading(false)
    }
  }

  const getUsedTeams = (excludeMatchId?: string) => {
    const used = new Set<string>()
    const usageMap = new Map<string, {matchId: string, position: 'team1' | 'team2', matchName: string}>()
    
    Object.entries(selectedTeams).forEach(([matchId, selection]) => {
      if (matchId !== excludeMatchId) {
        const match = tournamentData?.matchSchedule
          .flatMap(round => round.matches)
          .find(m => m.id === matchId)
        
        if (selection.team1) {
          used.add(selection.team1)
          usageMap.set(selection.team1, {
            matchId,
            position: 'team1',
            matchName: match ? `${getRoundName(match.round || 1, tournamentData?.matchSchedule.length || 1)} - Match` : 'Unknown Match'
          })
        }
        if (selection.team2) {
          used.add(selection.team2)
          usageMap.set(selection.team2, {
            matchId,
            position: 'team2', 
            matchName: match ? `${getRoundName(match.round || 1, tournamentData?.matchSchedule.length || 1)} - Match` : 'Unknown Match'
          })
        }
      }
    })
    return { used, usageMap }
  }

  const getAssignmentSummary = () => {
    const { usageMap } = getUsedTeams()
    const assignedTeams = Array.from(usageMap.entries()).map(([teamId, usage]) => ({
      teamId,
      teamName: getTeamName(teamId),
      ...usage
    }))
    
    return {
      totalTeams: availableTeams.length,
      assignedCount: assignedTeams.length,
      unassignedCount: availableTeams.length - assignedTeams.length,
      assignedTeams
    }
  }

  const isTeamAlreadyAssigned = (teamId: string, excludeMatchId?: string) => {
    const { used, usageMap } = getUsedTeams(excludeMatchId)
    return {
      isUsed: used.has(teamId),
      usage: usageMap.get(teamId)
    }
  }

  const handleTeamSelection = (matchId: string, position: 'team1' | 'team2', teamId: string) => {
    // Check if team is already assigned elsewhere
    if (teamId && teamId !== "") {
      const { isUsed, usage } = isTeamAlreadyAssigned(teamId, matchId)
      if (isUsed && usage) {
        setMessage(`⚠️ Warning: ${getTeamName(teamId)} is already assigned to ${usage.matchName}`)
        return // Prevent assignment
      }
    }

    setSelectedTeams(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [position]: teamId === "" ? undefined : teamId
      }
    }))
    
    // Clear message if successful
    setMessage("")
  }

  const getTeamName = (teamId: string) => {
    const team = availableTeams.find(t => t.id === teamId)
    return team ? team.teamName : "Select Team"
  }

  const validateAssignments = () => {
    const errors: string[] = []
    
    // Check for duplicate assignments within the same match
    Object.entries(selectedTeams).forEach(([, selection]) => {
      if (selection.team1 && selection.team2 && selection.team1 === selection.team2) {
        errors.push(`Match has the same team assigned to both positions`)
      }
    })
    
    // Check for teams assigned to multiple matches
    const teamCounts = new Map<string, number>()
    Object.values(selectedTeams).forEach(selection => {
      if (selection.team1) {
        teamCounts.set(selection.team1, (teamCounts.get(selection.team1) || 0) + 1)
      }
      if (selection.team2) {
        teamCounts.set(selection.team2, (teamCounts.get(selection.team2) || 0) + 1)
      }
    })
    
    teamCounts.forEach((count, teamId) => {
      if (count > 1) {
        errors.push(`${getTeamName(teamId)} is assigned to ${count} matches`)
      }
    })
    
    return errors
  }

  const saveTeamAssignments = async () => {
    try {
      setSaving(true)
      setMessage("")

      if (!tournamentData?.id) {
        setMessage("❌ No tournament data available")
        return
      }

      // Validate assignments before saving
      const validationErrors = validateAssignments()
      if (validationErrors.length > 0) {
        setMessage(`❌ Validation Error: ${validationErrors.join(', ')}`)
        return
      }

      console.log('Saving with tournament ID:', tournamentData.id)
      console.log('Selected teams:', selectedTeams)

      // Use server action instead of client-side API call
      const result = await saveTeamAssignmentsAction(tournamentData.id, selectedTeams)
      
      console.log('Server action response:', result)
      
      if (result.success) {
        setMessage("✅ Team assignments saved successfully!")
        // Optionally reload data to reflect changes
        if (initialTournamentData && initialTeamsData) {
          initializeWithServerData()
        } else {
          await loadData()
        }
      } else {
        setMessage(`❌ Failed to save: ${result.message}`)
      }
      
    } catch (error) {
      console.error('Error saving team assignments:', error)
      setMessage("❌ Error saving team assignments")
    } finally {
      setSaving(false)
    }
  }

  const getRoundName = (roundNumber: number, totalRounds: number) => {
    if (roundNumber === totalRounds) return "Final"
    if (roundNumber === totalRounds - 1) return "Semifinal"
    if (roundNumber === totalRounds - 2) return "Quarterfinal"
    return `Round ${roundNumber}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading tournament data...</span>
        </div>
      </div>
    )
  }

  if (!tournamentData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No Tournament Found
        </h3>
        <p className="text-gray-500">
          Create an elimination tournament first to assign teams.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Selection Sheet</h1>
            <p className="text-gray-600">Assign teams to tournament matches</p>
          </div>
        </div>
        <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />
      </div>

      {/* Status Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg text-sm ${
          message.includes('✅') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Assignment Summary */}
      <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Team Assignment Summary
        </h3>
        {(() => {
          const summary = getAssignmentSummary()
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{summary.totalTeams}</div>
                <div className="text-sm text-gray-600">Total Teams</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summary.assignedCount}</div>
                <div className="text-sm text-gray-600">Assigned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{summary.unassignedCount}</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>
          )
        })()}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button onClick={saveTeamAssignments} disabled={saving} className="bg-green-600 hover:bg-green-700">
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Team Assignments
            </>
          )}
        </Button>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Tournament Rounds */}
      <div className="space-y-8">
        {tournamentData.matchSchedule.map((round) => (
          <div key={round.round} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Round Header */}
            <div className={`px-6 py-4 ${
              round.round === tournamentData.matchSchedule.length 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : round.round === tournamentData.matchSchedule.length - 1
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600'  
                : 'bg-gradient-to-r from-blue-500 to-indigo-600'
            }`}>
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">
                  {getRoundName(round.round, tournamentData.matchSchedule.length)}
                </h2>
                <span className="text-white/80 text-sm">
                  ({round.matches.length} matches)
                </span>
              </div>
            </div>

            {/* Matches */}
            <div className="p-6">
              <div className="grid gap-4">
                {round.matches.map((match, matchIndex) => (
                  <div key={match.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        Match {matchIndex + 1}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        match.matchType === 'FINAL' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : match.matchType === 'SEMIFINAL'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {match.matchType}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      {/* Team 1 Selection */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Team 1
                        </label>
                        <select
                          value={selectedTeams[match.id]?.team1 || ""}
                          onChange={(e) => handleTeamSelection(match.id, 'team1', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={round.round > 1 && (match.team1 === "TBA" || match.team1Id === "")}
                        >
                          <option value="">Select Team</option>
                          {availableTeams.map((team) => {
                            const { isUsed, usage } = isTeamAlreadyAssigned(team.id, match.id)
                            const isCurrentlySelected = selectedTeams[match.id]?.team1 === team.id
                            const isAvailable = !isUsed || isCurrentlySelected
                            
                            return (
                              <option 
                                key={team.id} 
                                value={team.id}
                                disabled={!isAvailable}
                                style={{ 
                                  color: !isAvailable ? '#9CA3AF' : 'inherit',
                                  fontStyle: !isAvailable ? 'italic' : 'normal'
                                }}
                              >
                                {team.teamName} {!isAvailable && usage ? `(assigned to ${usage.matchName})` : ''}
                              </option>
                            )
                          })}
                        </select>
                      </div>

                      {/* VS */}
                      <div className="text-center">
                        <span className="text-2xl font-bold text-gray-400">VS</span>
                      </div>

                      {/* Team 2 Selection */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Team 2
                        </label>
                        <select
                          value={selectedTeams[match.id]?.team2 || ""}
                          onChange={(e) => handleTeamSelection(match.id, 'team2', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={round.round > 1 && (match.team2 === "TBA" || match.team2Id === "")}
                        >
                          <option value="">Select Team</option>
                          {availableTeams.map((team) => {
                            const { isUsed, usage } = isTeamAlreadyAssigned(team.id, match.id)
                            const isCurrentlySelected = selectedTeams[match.id]?.team2 === team.id
                            const isAvailable = !isUsed || isCurrentlySelected
                            
                            return (
                              <option 
                                key={team.id} 
                                value={team.id}
                                disabled={!isAvailable}
                                style={{ 
                                  color: !isAvailable ? '#9CA3AF' : 'inherit',
                                  fontStyle: !isAvailable ? 'italic' : 'normal'
                                }}
                              >
                                {team.teamName} {!isAvailable && usage ? `(assigned to ${usage.matchName})` : ''}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>

                    {/* Current Assignment Display */}
                    <div className="mt-3 p-3 bg-white rounded border text-sm">
                      <span className="text-gray-600">Current: </span>
                      <span className="font-medium">
                        {selectedTeams[match.id]?.team1 ? getTeamName(selectedTeams[match.id].team1!) : "TBA"}
                      </span>
                      <span className="text-gray-400 mx-2">vs</span>
                      <span className="font-medium">
                        {selectedTeams[match.id]?.team2 ? getTeamName(selectedTeams[match.id].team2!) : "TBA"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Assignment Rules:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• ✅ Each team can only be assigned to <strong>one match</strong></li>
          <li>• ✅ Teams already assigned will show as <span className="italic text-gray-500">&ldquo;(assigned to Match)&rdquo;</span> in dropdown</li>
          <li>• ✅ You cannot assign the same team to both positions in one match</li>
          <li>• ⚡ Only Round 1 matches can be manually assigned teams</li>
          <li>• 🏆 Round 2+ matches will be populated automatically when Round 1 matches are completed</li>
          <li>• 💾 Save your changes before leaving this page</li>
        </ul>
      </div>
    </div>
  )
}