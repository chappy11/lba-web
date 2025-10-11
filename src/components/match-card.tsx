"use client";
import { Match, SeasonGames } from "@/_lib/dto/MatchSchedule"
import { Player } from "@/_lib/dto/Player.model"
import {
  eliminationMatchScheduleUpdate,
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
  const [matchDate, setMatchDate] = useState<string>(gameDate || "TBA")
  const [matchTime, setMatchTime] = useState<string>(gameTime || "TBA")
  const [gameAddress, setGameAddress] = useState<string>(address)
  const [selectedWinner, setSelectedWinner] = useState<string>(winner)
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
      if (isElimination) {
        await handleUpdateElimination()
        Swal.fire({
          title: "Successs",
          text: "Successfully Updated",
          icon: "success",
        }).then((val) => {
          window.location.reload()
        })
        return
      }

      const updatedData = await updateMatch()

      const resp = await updateMatchSchedule(updatedData)
      Swal.fire({
        title: "Successs",
        text: "Successfully Updated",
        icon: "success",
      }).then((val) => {
        window.location.reload()
      })
      return resp.data
    } catch (error) {
      console.error("Error updating match:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleSelecteWinner(teamId: string) {
    if (selectedWinner === teamId) {
      setSelectedWinner("")
      return
    }

    setSelectedWinner(teamId)
  }

  async function handleUpdateElimination() {
    try {
      setIsLoading(true)

      const paylod: Match = {
        ...data,
        winner: isWinnerDeclared
          ? parseInt(teamOneScore, 10) > parseInt(teamTwoScore, 10)
            ? team1Id
            : team2Id
          : data.winner,
        team1Score: parseInt(teamOneScore, 10),
        team2Score: parseInt(teamTwoScore, 10),
        address: gameAddress,
        gameDate: matchDate,
        gameTime: matchTime,
        team1MatchScore:
          parseInt(teamOneScore, 10) > parseInt(teamTwoScore, 10)
            ? team1MatchScore + 1
            : team1MatchScore,
        team2MatchScore:
          parseInt(teamTwoScore, 10) > parseInt(teamOneScore, 10)
            ? team2MatchScore + 1
            : team2MatchScore,
      }

      const resp = await eliminationMatchScheduleUpdate(paylod)

      return resp.data
    } catch (error) {
      console.error("Error updating elimination match:", error)
    }
  }

  const handleCheckboxChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
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
                          Declare Series Winner
                        </h4>
                        <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleCheckboxChange}
                            checked={isWinnerDeclared}
                            className="mt-0.5"
                          />
                          <span>
                            Declaring winner will proceed to next round. If this
                            is a series game, please ignore this.
                          </span>
                        </label>
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
