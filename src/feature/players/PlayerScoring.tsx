"use client"

import { Match, SeasonGames } from "@/_lib/dto/MatchSchedule"
import { Player } from "@/_lib/dto/Player.model"
import {
  PlayerScoreModeBasedInsert,
  PlayerScoreModel,
  PlayerStatusPayloadBulkInsert,
} from "@/_lib/dto/TeamScoring.model"
import {
  getEliminationMatchSchedule,
  getMatchSchedule,
} from "@/_lib/server/matchSchedule"
import { getPlayerByTeams } from "@/_lib/server/player"
import { getPlayerGameStatus } from "@/_lib/server/playerStatus"

import { generateCsvForPlayerStatus } from "@/_lib/utils/csv.utils"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import PlayerStatusBatchUpload from "./PlayerStatusBatchUpload"
import UpdatePlayerScoringStatus from "./UpdatePlayerScoringStatus"

type Props = {
  gameId: string
  gameRecordId: string
  isUpdate: boolean
}

export default function PlayerScoring(props: Props) {
  const { gameId, gameRecordId } = props
  const [game, setGame] = useState<Match | null>(null)

  const [teamPlayerOne, setTeamPlayerOne] = useState<Player[]>([])
  const [teamPlayerTwo, setTeamPlayerTwo] = useState<Player[]>([])
  const [gamePlayerStatus, setGamePlayerStatus] = useState<
    Array<PlayerScoreModel>
  >([])
  const [showLeaderboard, setShowLeaderboard] = useState(true)

  const combineAllMatches = useCallback(async () => {
    const [roundRobin, elimination] = await Promise.all([
      fetchRoundRobinMatches(),
      fetchEliminationMatches(),
    ])

    const allMatches = [...(roundRobin ?? []), ...(elimination ?? [])]

    const findTheCurrentMatch = allMatches.find(
      (season) => season.id === gameRecordId
    ) as SeasonGames
    if (!findTheCurrentMatch) {
      console.log("No match found")
      return
    }
    const findTheGame = findTheCurrentMatch.matchSchedule
      .find((round) => round.matches.find((match) => match.id === gameId))
      ?.matches.find((match) => match.id === gameId) as Match

    setGame(findTheGame)

    if (!findTheGame) {
      return
    }

    const teamOnePlayers = await getPlayerByTeams(findTheGame.team1Id)
    const teamTwoPlayers = await getPlayerByTeams(findTheGame.team2Id)

    const playerScore = await getPlayerGameStatus(findTheGame.id)

    const [playersOne, playersTwo, scoreRecord] = await Promise.all([
      teamOnePlayers,
      teamTwoPlayers,
      playerScore,
    ])

    setTeamPlayerOne(playersOne)
    setTeamPlayerTwo(playersTwo)
    setGamePlayerStatus(scoreRecord)
  }, [gameId, gameRecordId])

  useEffect(() => {
    combineAllMatches()
  }, [combineAllMatches])

  const findPlayerStatus = useCallback(
    (playerId: string, key: string) => {
      const stats = gamePlayerStatus.find(
        (status) => status.playerId === playerId
      )

      if (!stats) return 0

      return (stats[key as keyof PlayerScoreModel] as number) ?? 0
    },
    [gamePlayerStatus]
  )

  const findPlayerStatusId = useCallback(
    (playerId: string) => {
      const stats = gamePlayerStatus.find(
        (status) => status.playerId === playerId
      )

      if (!stats) return null

      return stats.id ?? null
    },
    [gamePlayerStatus]
  )

  const teamLeaderboard = useMemo(() => {
    if (!game || teamPlayerOne.length === 0 || teamPlayerTwo.length === 0) {
      return []
    }

    const team1Stats = teamPlayerOne.reduce(
      (acc, player) => ({
        teamName: game.team1,
        teamLogo: game.team1Logo ?? "",
        points:
          acc.points + (findPlayerStatus(player.id as string, "points") || 0),
        threepoints:
          acc.threepoints +
          (findPlayerStatus(player.id as string, "threepoints") || 0),
        rebounds:
          acc.rebounds +
          (findPlayerStatus(player.id as string, "rebound") || 0),
        assists:
          acc.assists + (findPlayerStatus(player.id as string, "assist") || 0),
        steals:
          acc.steals + (findPlayerStatus(player.id as string, "steal") || 0),
        fouls: acc.fouls + (findPlayerStatus(player.id as string, "foul") || 0),
        turnovers:
          acc.turnovers +
          (findPlayerStatus(player.id as string, "turnOver") || 0),
      }),
      {
        teamName: "",
        teamLogo: "",
        points: 0,
        threepoints: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        fouls: 0,
        turnovers: 0,
      }
    )

    const team2Stats = teamPlayerTwo.reduce(
      (acc, player) => ({
        teamName: game.team2,
        teamLogo: game.team2Logo ?? "",
        points:
          acc.points + (findPlayerStatus(player.id as string, "points") || 0),
        threepoints:
          acc.threepoints +
          (findPlayerStatus(player.id as string, "threepoints") || 0),
        rebounds:
          acc.rebounds +
          (findPlayerStatus(player.id as string, "rebound") || 0),
        assists:
          acc.assists + (findPlayerStatus(player.id as string, "assist") || 0),
        steals:
          acc.steals + (findPlayerStatus(player.id as string, "steal") || 0),
        fouls: acc.fouls + (findPlayerStatus(player.id as string, "foul") || 0),
        turnovers:
          acc.turnovers +
          (findPlayerStatus(player.id as string, "turnOver") || 0),
      }),
      {
        teamName: "",
        teamLogo: "",
        points: 0,
        threepoints: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        fouls: 0,
        turnovers: 0,
      }
    )

    return [team1Stats, team2Stats].sort((a, b) => b.points - a.points)
  }, [game, teamPlayerOne, teamPlayerTwo, findPlayerStatus])

  const displayTeamCard = useCallback(
    (type: string) => {
      const teamplay = type === "ONE" ? teamPlayerOne : teamPlayerTwo

      return teamplay.map((player) => {
        const playerScore: PlayerScoreModeBasedInsert = {
          playerId: player.id as string,
          gameId: gameId,
          player: player,
          points: findPlayerStatus(player.id as string, "points") ?? 0,
          rebound: findPlayerStatus(player.id as string, "rebound") ?? 0,
          assist: findPlayerStatus(player.id as string, "assist") ?? 0,
          threepoints:
            findPlayerStatus(player.id as string, "threepoints") ?? 0,
          foul: findPlayerStatus(player.id as string, "foul") ?? 0,
          steal: findPlayerStatus(player.id as string, "steal") ?? 0,
          turnOver: findPlayerStatus(player.id as string, "turnOver") ?? 0,
        }

        return (
          <div
            className=" flex flex-row w-fit items-center gap-5 bg-white my-3 p-3 rounded-md shadow-md "
            key={player.id}
          >
            <div className=" flex flex-col gap-3 justify-center items-center w-[200px]">
              <Image
                src={player.playerImage}
                width={100}
                height={100}
                alt="player"
                className=" rounded-full h-[100px] w-[100px]"
              />
              <h1 className=" font-semibold text-center">
                {player.firstname.toUpperCase() +
                  " " +
                  player.middlename.toUpperCase() +
                  " " +
                  player.lastname.toUpperCase()}
              </h1>
            </div>
            <div className="flex flex-col gap-3 w-[150px]">
              <p>Points: {playerScore.points}</p>
              <p>3 pts: {playerScore.threepoints}</p>
              <p>Rebound: {playerScore.rebound}</p>
            </div>
            <div className="flex flex-col gap-3 w-[150px]">
              <p>Assist: {playerScore.assist}</p>
              <p>Steal: {playerScore.steal}</p>
              <p>Turn Over: {playerScore.turnOver}</p>
            </div>
            <div className="flex flex-col gap-3 w-[150px]">
              <p>Foul: {playerScore.foul}</p>
              <div className=" mt-2">
                <UpdatePlayerScoringStatus
                  {...playerScore}
                  id={findPlayerStatusId(player.id as string) ?? null}
                />
              </div>
            </div>
          </div>
        )
      })
    },
    [teamPlayerOne, teamPlayerTwo, gameId, findPlayerStatus, findPlayerStatusId]
  )

  async function fetchRoundRobinMatches() {
    try {
      const roundRobinMatches = await getMatchSchedule()

      return roundRobinMatches
    } catch (error) {
      console.log("Error Round Robin", error)
    }
  }

  async function fetchEliminationMatches() {
    try {
      const eliminationMatches = await getEliminationMatchSchedule()
      console.log("ELIMINATION", eliminationMatches)
      return eliminationMatches
    } catch (error) {
      console.log("Error Elimination", error)
    }
  }

  async function generateCsvReport() {
    // TO DO: generate csv report for player scoring
    const teamOnePlayer = teamPlayerOne.map((player) => {
      const teamOnePlayerStats: PlayerStatusPayloadBulkInsert = {
        gameId: gameId,
        playerId: player.id as string,
        firstName: player.firstname,
        lastName: player.lastname,
        points: findPlayerStatus(player.id as string, "points") ?? 0,
        threepoints: findPlayerStatus(player.id as string, "threepoints") ?? 0,
        foul: findPlayerStatus(player.id as string, "foul") ?? 0,
        assist: findPlayerStatus(player.id as string, "assist") ?? 0,
        steal: findPlayerStatus(player.id as string, "steal") ?? 0,
        rebound: findPlayerStatus(player.id as string, "rebound") ?? 0,
        turnOver: findPlayerStatus(player.id as string, "turnOver") ?? 0,
      }

      return teamOnePlayerStats
    })

    const teamTwoPlayer = teamPlayerTwo.map((player) => {
      const teamTwoPlayerStats: PlayerStatusPayloadBulkInsert = {
        gameId: gameId,
        playerId: player.id as string,
        firstName: player.firstname,
        lastName: player.lastname,
        points: findPlayerStatus(player.id as string, "points") ?? 0,
        threepoints: findPlayerStatus(player.id as string, "threepoints") ?? 0,
        foul: findPlayerStatus(player.id as string, "foul") ?? 0,
        assist: findPlayerStatus(player.id as string, "assist") ?? 0,
        steal: findPlayerStatus(player.id as string, "steal") ?? 0,
        rebound: findPlayerStatus(player.id as string, "rebound") ?? 0,
        turnOver: findPlayerStatus(player.id as string, "turnOver") ?? 0,
      }

      return teamTwoPlayerStats
    })

    const combinedPlayerStats = [...teamOnePlayer, ...teamTwoPlayer]

    console.log("COMBINED PLAYER STATS", combinedPlayerStats)

    await generateCsvForPlayerStatus({
      data: combinedPlayerStats,
      title: `Player Scoring Report - Game ${game?.team1} vs ${game?.team2}`,
      subTitle: `Game ID: ${gameId}`,
    })
  }

  return (
    <div className=" w-[80%] mx-auto">
      <div className="my-5 flex justify-between items-center">
        <PlayerStatusBatchUpload downLoadCsv={generateCsvReport} />
        <Button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Trophy className="mr-2 h-4 w-4" />
          {showLeaderboard ? "Hide" : "Show"} Leaderboard
        </Button>
      </div>

      {showLeaderboard && teamLeaderboard.length > 0 && (
        <div className="mb-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-purple-600" />
            Team Leaderboard
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <th className="px-4 py-3 text-left rounded-tl-lg">Rank</th>
                  <th className="px-4 py-3 text-left">Team</th>
                  <th className="px-4 py-3 text-center">Points</th>
                  <th className="px-4 py-3 text-center">3PT</th>
                  <th className="px-4 py-3 text-center">Rebounds</th>
                  <th className="px-4 py-3 text-center">Assists</th>
                  <th className="px-4 py-3 text-center">Steals</th>
                  <th className="px-4 py-3 text-center">Fouls</th>
                  <th className="px-4 py-3 text-center rounded-tr-lg">
                    Turnovers
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamLeaderboard.map((team, index) => (
                  <tr
                    key={team.teamName}
                    className={`border-b hover:bg-purple-50 transition-colors ${
                      index === 0 ? "bg-amber-50" : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <Trophy className="h-5 w-5 text-amber-500" />
                        )}
                        <span className="font-semibold text-lg">
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {team.teamLogo && (
                          <Image
                            src={team.teamLogo}
                            width={40}
                            height={40}
                            alt={team.teamName}
                            className="rounded-full"
                          />
                        )}
                        <span className="font-semibold">
                          {team.teamName.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-bold text-purple-600 text-lg">
                        {team.points}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {team.threepoints}
                    </td>
                    <td className="px-4 py-4 text-center">{team.rebounds}</td>
                    <td className="px-4 py-4 text-center">{team.assists}</td>
                    <td className="px-4 py-4 text-center">{team.steals}</td>
                    <td className="px-4 py-4 text-center text-red-600">
                      {team.fouls}
                    </td>
                    <td className="px-4 py-4 text-center text-orange-600">
                      {team.turnovers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className=" flex flex-row justify-between items-center my-5">
        <div>
          <div className=" flex flex-row items-center gap-5">
            <div className=" h-[150px] w-[150px] flex justify-center items-center rounded-full">
              {game?.team1Logo && (
                <Image
                  src={game?.team1Logo}
                  width={200}
                  height={200}
                  alt="team1"
                />
              )}
            </div>
            <h1 className=" font-semibold">{game?.team1.toUpperCase()}</h1>
          </div>
          {displayTeamCard("ONE")}
        </div>
        <div>
          <div className=" flex flex-row items-center gap-5">
            <div className=" h-[150px] w-[150px] flex justify-center items-center rounded-full">
              {game?.team2Logo && (
                <Image
                  src={game?.team2Logo}
                  width={150}
                  height={150}
                  alt="team2"
                  className=" rounded-full"
                />
              )}
            </div>
            <h1 className=" font-semibold">{game?.team2.toUpperCase()}</h1>
          </div>
          {displayTeamCard("TWO")}
        </div>
      </div>
    </div>
  )
}
