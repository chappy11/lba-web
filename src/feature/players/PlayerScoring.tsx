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
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
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

  const combineAllMatches = async () => {
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
  }

  useEffect(() => {
    combineAllMatches()
  }, [])

  

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
        id: findPlayerStatusId(player.id as string) ?? null,
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
        id: findPlayerStatusId(player.id as string) ?? null,
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
      <div className="my-5">
        <PlayerStatusBatchUpload downLoadCsv={generateCsvReport} />
      </div>
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
