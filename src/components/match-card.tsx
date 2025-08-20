"use client";

import { Match, SeasonGames } from "@/_lib/dto/MatchSchedule"
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
} from "@/components/ui/sheet";
import { useState } from "react";
import TextInput from "./textinput";
import { Button } from "./ui/button"

type Props = {
  data: Match
  id: string
  games: SeasonGames
  isUseMatchScore?: boolean
  isElimination?: boolean
}

export default function MatchCard(props: Props) {
  const { data, games, isUseMatchScore = false, isElimination = false } = props
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

        return
      }

      const updatedData = await updateMatch()

      const resp = await updateMatchSchedule(updatedData)

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
        winner: selectedWinner,
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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Match Details</SheetTitle>
          <SheetDescription>
            {team1} VS {team2}
          </SheetDescription>
        </SheetHeader>
        <div className=" p-2">
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

          {address !== "TBA" ||
          gameTime !== "TBA" ||
          (gameDate !== "TBA" && !isElimination) ? (
            <>
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
            </>
          ) : (
            <p className=" text-sm text-red-500">
              <span className=" font-bold">Notes: </span>You cannot update the
              score, date, or time until the match is played.
            </p>
          )}
          {isElimination && (
            <>
              <h1 className=" text-[14px] font-semibold mt-3">
                Declare Series Winner
              </h1>
              <p className=" text-xs">
                Declaring winner will proceed to next round if this a series
                games please ignore this
              </p>
              <div className=" flex flex-row gap-3 mt-3">
                <div
                  onClick={() => handleSelecteWinner(team1Id)}
                  className={` p-2 border border-gray-400 rounded-md cursor-pointer text-sm ${
                    selectedWinner === team1Id
                      ? "bg-blue-500 text-white"
                      : "bg-white	 text-black"
                  }`}
                >
                  {team1}
                </div>
                <div
                  onClick={() => handleSelecteWinner(team2Id)}
                  className={` p-2 border border-gray-400 cursor-pointer rounded-md text-sm ${
                    selectedWinner === team2Id
                      ? "bg-blue-500 text-white"
                      : "bg-white	 text-black"
                  }`}
                >
                  {team2}
                </div>
              </div>
            </>
          )}
          <div className=" h-3" />
          <div className=" flex w-full justify-end">
            <Button onClick={() => handleUpdate()}>
              {isLoading ? <span>Loading...</span> : "Update"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
