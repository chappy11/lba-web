"use client"

import { MatchTeam, SeasonGames } from "@/_lib/dto/MatchSchedule"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import TextInput from "./textinput"
import { Button } from "./ui/button"

type Props = {
  data: MatchTeam
  id: string
  games: SeasonGames
}

export default function MatchCard(props: Props) {
  const { data, games, id: firebaseId } = props
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
  } = data
  const { matchSchedule } = games
  const team1ScoreText = team1Score > 0 ? team1Score.toString() : "TBA"
  const team2ScoreText = team2Score > 0 ? team2Score.toString() : "TBA"
  const [teamOne1Score, setTeamOne1Score] = useState<string>(
    team1Score.toString()
  )
  const [teamTwoScore, setTeamTwoScore] = useState<string>(
    team2Score.toString()
  )
  const [score1, setScore1] = useState<string>(teamOne1Score)
  const [score2, setScore2] = useState<string>(teamTwoScore)
  const [matchDate, setMatchDate] = useState<string>(gameDate || "TBA")
  const [matchTime, setMatchTime] = useState<string>(gameTime || "TBA")
  const [gameAddress, setGameAddress] = useState<string>("")

  // async function handleUpdate(round: number) {
  //   const chooseRound = 2
  //   const matchUpdate = {
  //     team2Score: 28,
  //     id: "8a070438-7871-469b-9f4c-7ba87ae409ae",
  //     winner: "IcNVix35nL4Z2F6cqjQi",
  //     team1Score: 32,
  //     team1Id: "IcNVix35nL4Z2F6cqjQi",
  //     team2: "Cleveland",
  //     address: "TBA",
  //     team1: "Nuggets",
  //     team2Id: "ziEb9zNe9LDQAkLRCofa",
  //   }

  //   const findRoundIndex = data.findIndex(
  //     (round) => chooseRound === round.round
  //   )
  //   if (findRoundIndex !== -1) {
  //     const findMatchIndex = data[findRoundIndex].matches.findIndex(
  //       (match) => match.id === matchUpdate.id
  //     )

  //     if (findMatchIndex !== -1) {
  //       const updatedMatches = [...data]
  //       updatedMatches[findRoundIndex].matches[findMatchIndex] = matchUpdate
  //       setData(updatedMatches)
  //     } else {
  //       console.error("Match not found")
  //     }
  //   } else {
  //     console.error("Round not found")
  //   }
  // }

  async function updateMatch() {
    const updatedMatch: MatchTeam = {
      ...data,
      team1Score: parseInt(teamOne1Score, 10),
      team2Score: parseInt(teamTwoScore, 10),
      address: gameAddress,
      winner:
        parseInt(teamOne1Score, 10) > parseInt(teamTwoScore, 10)
          ? team1Id
          : team2Id,
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

    console.log("UPDATED", updatedData)

    return updatedData
  }
  return (
    <Sheet>
      <SheetTrigger>
        <div
          className=" border border-gray-200  rounded-md flex flex-col w-[200px] hover:cursor-pointer"
          onClick={() => console.log(JSON.stringify(props, null, 2))}
        >
          <div className="flex items-center p-2 flex-row justify-between">
            <p>{team1}</p>
            <p>{team1ScoreText}</p>
          </div>
          <div className=" border border-gray-200 w-full" />
          <div className="flex items-center p-2 flex-row justify-between">
            <p>{team2}</p>
            <p>{team2ScoreText}</p>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Schedule</SheetTitle>
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
            value={gameDate}
            onChange={(e) => setMatchDate(e.target.value)}
          />
          <TextInput
            label="Game Time"
            type="time"
            value={gameTime}
            onChange={(e) => setMatchTime(e.target.value)}
          />
          <TextInput
            label={team1 + " Score"}
            type="number"
            value={score1}
            onChange={(e) => setScore1(e.target.value)}
          />
          <TextInput
            label={team2 + " Score"}
            type="number"
            value={score2}
            onChange={(e) => setScore2(e.target.value)}
          />
          <Button onClick={() => updateMatch()}>Update </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
