import { Player } from "./Player.model"

export type PlayerGameInfo = Pick<
  Player,
  | "id"
  | "firstname"
  | "middlename"
  | "lastname"
  | "jerseyNumber"
  | "playerImage"
  | "position"
>

export interface PlayerScoreModel {
  id: string
  playerId: string
  gameId: string
  player: PlayerGameInfo
  points: number
  rebound: number
  assist: number
  threepoints: number
  steal: number
  foul: number
  turnOver: number
}

export type PlayerScoreModeBasedInsert = Omit<PlayerScoreModel, "id">

export type PlayerStatusPayload = PlayerScoreModeBasedInsert & {
  id: string | null
}
