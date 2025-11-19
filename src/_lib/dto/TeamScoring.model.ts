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
  id: string | null
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

export type PlayerStatusPayloadBulkInsert = Omit<
  PlayerScoreModeBasedInsert,
  "player"
> & {
  firstName: string
  lastName: string
}