import { axiosConfig } from "../config/config"
import { InsertPlayerViaBatchUpload, Player } from "../dto/Player.model"

export const createPlayer = async (player: Player) => {
  const resp = await axiosConfig.post("/players", player)

  return resp.data
}

export const getPlayerByTeams = async (teamId: string) => {
  const resp = await axiosConfig.get(`/players?teamId=${teamId}`)
  console.log(teamId, resp.data)
  return resp.data
}

export const getAllPlayers = async () => {
  const resp = await axiosConfig.get("/players")

  return resp.data
}

export const getPlayerById = async (playerId: string) => {
  const resp = await axiosConfig.get(`/players?playerId=${playerId}`)

  return resp.data
}

export const createPlayerViaBatchUpload = async (
  players: InsertPlayerViaBatchUpload[]
) => {
  const resp = await axiosConfig.post("/players/batch-upload", players)

  return resp.data
}

export const updatePlayerById = async (
  playerId: string,
  player: Omit<Player, "id">
) => {
  const resp = await axiosConfig.put(`/players?playerId=${playerId}`, player)

  return resp.data
}
