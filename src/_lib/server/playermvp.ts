import { axiosConfig } from "../config/config";
import { CreatePlayerPlayload } from "../dto/PlayerMvp.model";

export const addMvpPlayer = async (payload:CreatePlayerPlayload) => {
    const resp = await axiosConfig.post('/mvp/game-mvp', payload)
    
    return resp.data;
}

export const getGameMvp = async (gameId:string) => {
    const resp = await axiosConfig.get(`/mvp/game-mvp?gameId=${gameId}`);
    
    return resp.data;
}

export const getPlayerMvpByPlayerId = async (playerId:string) => {
    const resp = await axiosConfig.get(`/mvp/player-mvp?playerId=${playerId}`);
    
    return resp.data;
}