import { axiosConfig } from "../config/config";
import {
  PlayerStatusPayload,
  PlayerStatusPayloadBulkInsert,
} from "../dto/TeamScoring.model"

export const createPlayerStatus = async (payload: PlayerStatusPayload) => {
    const response = await axiosConfig.post("/player-status", payload)
    
    return response.data;
}


export const getPlayerGameStatus = async (gameId:string) => {
    const response = await axiosConfig.get(`/player-status?gameId=${gameId}`);
        console.log("GG")
    return response.data;
}

export const getPlayerScoresByPlayerId = async (playerId: string) => {
  const response = await axiosConfig.get(
    `/player-status/by-player?playerId=${playerId}`
  )

  return response.data
}

export const insertBulkPlayerStatus = async (
  payload: PlayerStatusPayloadBulkInsert[]
) => {
  const response = await axiosConfig.post("/player-status/bulk-insert", payload)
  return response.data
} 