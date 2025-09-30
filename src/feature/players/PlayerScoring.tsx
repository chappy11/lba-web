import { Match, SeasonGames } from "@/_lib/dto/MatchSchedule"
import { Player } from "@/_lib/dto/Player.model"
import {
  PlayerScoreModeBasedInsert,
  PlayerScoreModel,
} from "@/_lib/dto/TeamScoring.model"
import {
  getEliminationMatchSchedule,
  getMatchSchedule,
} from "@/_lib/server/matchSchedule"
import { getPlayerByTeams } from "@/_lib/server/player"
import { getPlayerGameStatus } from "@/_lib/server/playerStatus"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCallback, useEffect, useMemo, useState } from "react"
import UpdatePlayerScoringStatus from "./UpdatePlayerScoringStatus"

type Props = {
  gameId: string
  gameRecordId: string
  isUpdate: boolean
}

export default function PlayerScoring(props: Props) {
  const { gameId, gameRecordId, isUpdate } = props
  const [matches, setMathes] = useState<SeasonGames[]>([])
  const [game, setGame] = useState<Match | null>(null)

  const [teamPlayerOne, setTeamPlayerOne] = useState<Player[]>([])
  const [teamPlayerTwo, setTeamPlayerTwo] = useState<Player[]>([])
  const [gamePlayerStatus, setGamePlayerStatus] = useState<
    Array<PlayerScoreModel>
  >([])

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

      return eliminationMatches
    } catch (error) {
      console.log("Error Elimination", error)
    }
  }

  const combineAllMatches = async () => {
    const [roundRobin, elimination] = await Promise.all([
      fetchRoundRobinMatches(),
      fetchEliminationMatches(),
    ])

    const allMatches = [...(roundRobin ?? []), ...(elimination ?? [])]
    console.log("ID", gameRecordId)
    const findTheCurrentMatch = allMatches.find(
      (season) => season.id === gameRecordId
    ) as SeasonGames

    console.log(allMatches)
    if (!findTheCurrentMatch) {
      console.log("No match found")
      return
    }
    const findTheGame = findTheCurrentMatch.matchSchedule
      .find((round) => round.matches.find((match) => match.id === gameId))
      ?.matches.find((match) => match.id === gameId) as Match

    setGame(findTheGame)

    if (!findTheGame) {
      console.log("No game found")
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
      console.log("St", stats)
      if (!stats) return null

      return stats.id ?? null
    },
    [gamePlayerStatus]
  )

  const displayTableRowTeamOne = useMemo(() => {
    {
      return teamPlayerOne.map((player, index) => {
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
        }

        console.log("TEST", findPlayerStatusId(player?.id as string))
        return (
          <TableRow key={player.id}>
            <TableCell>
              {player.firstname.toUpperCase()} {player.lastname.toUpperCase()}
            </TableCell>
            <TableCell>
              {findPlayerStatus(player.id as string, "rebound").toString()}
            </TableCell>
            <TableCell>
              {findPlayerStatus(player.id as string, "assist").toString()}
            </TableCell>
            <TableCell>
              {findPlayerStatus(player.id as string, "threepoints").toString()}
            </TableCell>
            <TableCell>
              {findPlayerStatus(player.id as string, "foul").toString()}
            </TableCell>
            <TableCell>
              {findPlayerStatus(player.id as string, "steal").toString()}
            </TableCell>
            <TableCell>
              {findPlayerStatus(player.id as string, "points").toString()}
            </TableCell>
            <TableCell>
              <UpdatePlayerScoringStatus
                {...playerScore}
                id={findPlayerStatusId(player.id as string) ?? null}
              />
            </TableCell>
          </TableRow>
        )
      })
    }
  }, [gameId, teamPlayerOne, findPlayerStatus, findPlayerStatusId])

  return (
    <div className=" w-[80%] mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player Name</TableHead>
            <TableHead>Rebound</TableHead>
            <TableHead>Assist</TableHead>
            <TableHead>Threepoints</TableHead>
            <TableHead>Foul</TableHead>
            <TableHead>Steal</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{displayTableRowTeamOne}</TableBody>
        <TableBody>
          {teamPlayerTwo.map((player, index) => {
            return (
              <TableRow className=" border border-b" key={player.id}>
                <TableCell>
                  {player.firstname} {player.lastname}
                </TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell>
                  {findPlayerStatus(player.id as string, "rebound").toString()}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
