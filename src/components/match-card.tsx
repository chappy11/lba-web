"use client";
import { CreateMatchResult, Match, SeasonGames } from "@/_lib/dto/MatchSchedule"
import { Player } from "@/_lib/dto/Player.model"
import {
  eliminationMatchScheduleUpdate,
  insertMatchResult,
  updateEliminationMatchWithAdvancement,
  updateMatchSchedule,
} from "@/_lib/server/matchSchedule"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import UpdateMvpOfTheGame from "@/feature/MatchSchedule/UpdateMvpOfTheGame"
import { Award, CheckCircle2, MapPin, Trophy } from "lucide-react"
import Link from "next/link"
import { useState } from "react";

import Swal from "sweetalert2"
import TextInput from "./textinput";
import { Button } from "./ui/button"

type Props = {
  data: Match
  id: string
  games: SeasonGames
  isUseMatchScore?: boolean
  isElimination?: boolean
  matchId: string
}

export default function MatchCard(props: Props) {
  const {
    data,
    games,
    isUseMatchScore = false,
    isElimination = false,
    matchId,
  } = props
  const {
    team1,
    team2,
    team1Score,
    team2Score,
    id,
    address,
    team1Id,
    team2Id,
    gameDate,
    gameTime,
    winner,
    team1MatchScore,
    team2MatchScore,
  } = data

  const team1ScoreText = team1Score > 0 ? team1Score.toString() : "TBA"
  const team2ScoreText = team2Score > 0 ? team2Score.toString() : "TBA"
  const [teamOneScore, setTeamOneScore] = useState<string>(
    team1Score.toString()
  )
  const [teamTwoScore, setTeamTwoScore] = useState<string>(
    team2Score.toString()
  )

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [matchDate, setMatchDate] = useState<string>(
    gameDate === "TBA" ? "" : gameDate || ""
  )
  const [matchTime, setMatchTime] = useState<string>(
    gameTime === "TBA" ? "" : gameTime || ""
  )
  const [gameAddress, setGameAddress] = useState<string>(
    address === "TBA" ? "" : address || ""
  )
  const [isWinnerDeclared, setIsWinnerDeclared] = useState<boolean>(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  async function updateMatch() {
    let winner = "TBA"
    if (parseInt(teamOneScore, 10) < 1 || parseInt(teamTwoScore, 10) < 1) {
      winner = "TBA"
    } else if (parseInt(teamOneScore, 10) > parseInt(teamTwoScore, 10)) {
      winner = team1Id
    } else if (parseInt(teamOneScore, 10) < parseInt(teamTwoScore, 10)) {
      winner = team2Id
    } else {
      winner = "TBA"
    }
    const updatedMatch: Match = {
      ...data,
      team1Score: parseInt(teamOneScore, 10),
      team2Score: parseInt(teamTwoScore, 10),
      address: gameAddress,
      winner: winner,
      gameDate: matchDate,
      gameTime: matchTime,
    }

    const matchResultPayload: CreateMatchResult = {
      team1Score: parseInt(teamOneScore, 10),
      team2Score: parseInt(teamTwoScore, 10),
      team1Id: data.team1Id,
      team2Id: data.team2Id,
      gameDate: data.gameDate,
      gameId: data.id,
      team1: data.team1,
      team2: data.team2,
      winner: data.winner,
      playerMvp: data.playerMvp,
      seasonId: games.seasonId,
      team1Logo: data.team1Logo || "",
      team2Logo: data.team2Logo || "",
    }

    await insertMatchResult(matchResultPayload)
  
    const updatedData = {
      ...games,
      matchSchedule: games.matchSchedule.map((round) => ({
        ...round,
        matches: round.matches.map((match) =>
          match.id === id ? updatedMatch : match
        ),
      })),
    }

    return updatedData
  }

  async function handleUpdate() {
    try {
      setIsLoading(true)

      // Validate basic required fields
      if (!gameAddress.trim()) {
        Swal.fire({
          title: "Validation Error",
          text: "Please enter a game address",
          icon: "warning",
        })
        return
      }

      if (!matchDate) {
        Swal.fire({
          title: "Validation Error",
          text: "Please select a game date",
          icon: "warning",
        })
        return
      }

      if (!matchTime) {
        Swal.fire({
          title: "Validation Error",
          text: "Please select a game time",
          icon: "warning",
        })
        return
      }

      console.log("Updating match with data:", {
        isElimination,
        gameAddress,
        matchDate,
        matchTime,
        team1Score: teamOneScore,
        team2Score: teamTwoScore,
      })

      if (isElimination) {
        await handleUpdateElimination()

        // Determine winner name for success message
        const winnerName = isWinnerDeclared
          ? parseInt(teamOneScore, 10) > parseInt(teamTwoScore, 10)
            ? team1
            : team2
          : "No winner declared"

        const successMessage = isWinnerDeclared
          ? `🏆 Match updated successfully! ${winnerName} has been advanced to the Quarter Finals! Check the tournament bracket to see the updated teams.`
          : "✅ Match updated successfully!"

        Swal.fire({
          title: "Success",
          text: successMessage,
          icon: "success",
          confirmButtonText: "Great!",
        }).then(() => {
          window.location.reload()
        })
        return
      }

      const updatedData = await updateMatch()

      const resp = await updateMatchSchedule(updatedData)
      Swal.fire({
        title: "Success",
        text: "Successfully Updated",
        icon: "success",
      }).then(() => {
        window.location.reload()
      })
      return resp.data
    } catch (error) {
      console.error("Error updating match:", error)
      Swal.fire({
        title: "Error",
        text: "Failed to update match. Please try again.",
        icon: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpdateElimination() {
    try {
      setIsLoading(true)

      // Determine the winner based on scores and winner declaration
      let matchWinner = data.winner
      if (isWinnerDeclared) {
        matchWinner =
          parseInt(teamOneScore, 10) > parseInt(teamTwoScore, 10)
            ? team1Id
            : team2Id
      }

      const payload: Match = {
        ...data,
        winner: matchWinner,
        team1Score: parseInt(teamOneScore, 10) || 0,
        team2Score: parseInt(teamTwoScore, 10) || 0,
        address: gameAddress || "TBA",
        gameDate: matchDate || "TBA",
        gameTime: matchTime || "TBA",
        team1MatchScore:
          parseInt(teamOneScore, 10) > parseInt(teamTwoScore, 10)
            ? team1MatchScore + 1
            : team1MatchScore,
        team2MatchScore:
          parseInt(teamTwoScore, 10) > parseInt(teamOneScore, 10)
            ? team2MatchScore + 1
            : team2MatchScore,
      }

      console.log("🔄 Updating elimination match with payload:", {
        matchId: payload.id,
        address: payload.address,
        gameDate: payload.gameDate,
        gameTime: payload.gameTime,
        team1Score: payload.team1Score,
        team2Score: payload.team2Score,
        isWinnerDeclared,
        winner: matchWinner,
      })

      // Use the appropriate update function based on whether winner is being declared
      let resp
      try {
        if (isWinnerDeclared) {
          console.log("🏆 Using winner advancement update...")
          // Use the advancement function that will automatically place winner in next round
          resp = await updateEliminationMatchWithAdvancement(payload, true)
          console.log("✅ Winner advancement update successful:", resp)
        } else {
          console.log("🎯 Using standard elimination update...")
          // Standard update without advancement
          resp = await eliminationMatchScheduleUpdate(payload)
          console.log("✅ Standard update successful:", resp)
        }
      } catch (updateError) {
        console.error("❌ Update failed:", updateError)

        // Show detailed error message
        Swal.fire({
          title: "API Error",
          text: `Update failed: ${
            updateError instanceof Error ? updateError.message : "Unknown error"
          }`,
          icon: "error",
        })
        throw updateError
      }

      return resp.data || resp
    } catch (error) {
      console.error("💥 Error updating elimination match:", error)

      // Show detailed error information
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"
      Swal.fire({
        title: "Update Failed",
        html: `
          <p>Failed to update match details.</p>
          <br>
          <p><strong>Error:</strong> ${errorMessage}</p>
          <br>
          <p><strong>Debug Info:</strong></p>
          <ul style="text-align: left; margin: 10px 0;">
            <li>Match ID: ${data.id}</li>
            <li>Address: ${gameAddress}</li>
            <li>Date: ${matchDate}</li>
            <li>Time: ${matchTime}</li>
          </ul>
          <br>
          <p>Please check the browser console for more details.</p>
        `,
        icon: "error",
        width: 600,
      })
      throw error
    }
  }

  const handleCheckboxChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) }
  }) => {
    setIsWinnerDeclared(event.target.checked)
  }
  return (
    <Sheet>
      <SheetTrigger>
        <div
          className=" border border-gray-200 bg-white  rounded-md flex flex-col w-[200px] hover:cursor-pointer"
          onClick={() => console.log(JSON.stringify(props, null, 2))}
        >
          <div className="flex items-center p-2 flex-row justify-between">
            <p>{isUseMatchScore ? team1MatchScore : team1ScoreText}</p>
            <p>{team1}</p>

            {winner === team1Id ? (
              <p className=" text-green-500 text-right">W</p>
            ) : (
              <p></p>
            )}
          </div>
          <div className=" border border-gray-200 w-full" />
          <div className="flex items-center p-2 flex-row justify-between">
            <p>{isUseMatchScore ? team2MatchScore : team2ScoreText}</p>
            <p>{team2}</p>
            {winner === team2Id ? (
              <p className=" text-green-500">W</p>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Match Details
          </SheetTitle>
          <SheetDescription className="text-lg font-semibold text-gray-700">
            {team1} VS {team2}
          </SheetDescription>
        </SheetHeader>

        <div className="p-2 space-y-4 mt-6">
          {/* Match Information Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            {team1 === "TBA" || team2 === "TBA" ? (
              <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Trophy className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Teams Not Assigned
                    </h3>
                    <p className="text-sm text-gray-600">
                      Please assign teams to this match before updating details.
                    </p>
                  </div>
                </div>
                <Link
                  href={"/administrator/match-schedule/team-assignment"}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Trophy className="w-4 h-4" />
                  Assign Teams
                </Link>
              </div>
            ) : null}
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Match Information</h3>
            </div>
            <div className="space-y-3">
              <TextInput
                label="Game Address"
                type="text"
                value={gameAddress}
                onChange={(e) => setGameAddress(e.target.value)}
              />
              <TextInput
                label="Game Date"
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
              />
              <TextInput
                label="Game Time"
                type="time"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
              />
            </div>
          </div>

          {/* Scores Section */}
          {address !== "TBA" ||
          gameTime !== "TBA" ||
          (gameDate !== "TBA" && !isElimination) ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-gray-900">Match Score</h3>
              </div>
              <div className="space-y-3">
                <TextInput
                  label={team1 + " Score"}
                  type="number"
                  value={teamOneScore}
                  onChange={(e) => setTeamOneScore(e.target.value)}
                />
                <TextInput
                  label={team2 + " Score"}
                  type="number"
                  value={teamTwoScore}
                  onChange={(e) => setTeamTwoScore(e.target.value)}
                />
                {isElimination && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Declare Series Winner & Advance to Next Round
                        </h4>
                        <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleCheckboxChange}
                            checked={isWinnerDeclared}
                            className="mt-0.5"
                          />
                          <span>
                            🏆 Declaring winner will automatically advance the
                            winning team to the next round (Quarter Finals, Semi
                            Finals, or Finals). The winner will be determined by
                            the higher score above. If this is a series game,
                            please leave unchecked.
                          </span>
                        </label>

                        {isWinnerDeclared && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                              <Trophy className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                Winner:{" "}
                                {parseInt(teamOneScore, 10) >
                                parseInt(teamTwoScore, 10)
                                  ? team1
                                  : team2}
                              </span>
                            </div>
                            <p className="text-xs text-green-700 mb-1">
                              🚀 This team will be automatically placed in the
                              Quarter Finals when you update the match.
                            </p>
                            <p className="text-xs text-green-600 font-medium">
                              ⚡ Winner advancement is active - the tournament
                              bracket will update automatically!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-red-900 mb-1">
                    Match Not Scheduled
                  </h4>
                  <p className="text-sm text-red-700">
                    You cannot update the score until the match date, time, and
                    venue are set.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Update Button */}
          <div className="flex w-full justify-end pt-2">
            <Button
              onClick={() => handleUpdate()}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update Match"
              )}
            </Button>
          </div>
        </div>

        {/* MVP and Links Section */}
        <div className="w-full px-3 mt-6">
          {winner !== "TBA" && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">Post-Match</h3>
              </div>
              <UpdateMvpOfTheGame
                teamId={winner}
                gameId={id}
                selectedPlayer={selectedPlayer}
                setSelectedPlayer={setSelectedPlayer}
              />
              <Link
                href={`match-schedule/player-standing?gameId=${id}&matchId=${matchId}`}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold underline transition-colors"
              >
                <Trophy className="w-4 h-4" />
                View Player Standings
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
