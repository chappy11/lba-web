import { PlayerType } from "@/feature/players/CreatePlayer"

import { Team } from "./Team.model"

export interface Player {
  id?: string
  teamId: string
  firstname: string
  middlename: string
  lastname: string
  position: string
  age: number
  jerseyNumber: string
  dateCreated: string
  playerImage: string
  playerType: PlayerType
  height: string
  weight: string
}

export type PlayerInsertPayload = Omit<Player, "id">

export type PlayerWithTeam = Player & {
  team: Team
}

export type InsertPlayerViaBatchUpload = Omit<Player, "id" | "playerImage">

export type PlayerResponse = PlayerWithTeam
