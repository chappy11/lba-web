export type MatchTeam = {
  id: string
  team1: string
  team2: string
  team1Id: string
  team2Id: string
  team1Score: number
  team2Score: number
  winner: string
  address: string
  gameDate: string
  gameTime: string
}

export type MatchRound = {
    round: number;
    matches: MatchTeam[];
}

export type Standing = {
  teamId: string
  teamName: string
  wins: number
  losses: number
  goalsFor: number
}

export type Team = {
  teamId: string
  teamName: string
}

type PlayerMvp = {
  teamId: string
  playerId: string
  firstName: string
  middleName: string
  lastName: string
  score: number
  assists: number
  rebounds: number
}

export type Match = {
  id: string
  team1: string
  team2: string
  team1Id: string
  team2Id: string
  team1Score: number
  team2Score: number
  winner: string
  address: string
  gameDate: string
  gameTime: string
  matchType: MatchType
  gameType: GameType
  playerMvp: PlayerMvp | null
}

export type Round = {
  round: number
  matches: Match[]
}

export enum MatchType {
  SEMIFINAL = "SEMIFINAL",
  FINAL = "FINAL",
  NONE = "NONE",
}

export enum GameType {
  ROUND_ROBIN = "ROUND_ROBIN",
  ELIMINATION = "ELIMINATION",
}

export type MatchSchedule = Array<Match>

export type SeasonGames = {
  id: string
  seasonId: string
  done: boolean
  matchSchedule: Array<Round>
  matchType: GameType
}


export type CreateMatchSchedule = Omit<SeasonGames, "id">;