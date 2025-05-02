import { axiosConfig } from "../config/config";
import { TeamInsertPayload } from "../dto/Team.model";
import { GameType } from "../enums/GameTypeEnum";

export const createTeam = async (payload:TeamInsertPayload) => {
    const resp = await axiosConfig.post("/teams",payload);
    
    return resp.data;
}

export const getCurrentFromThisSeason = async (gameType:GameType) => {
    const resp = await axiosConfig.get(`/teams/current-season?gameType=${gameType}`);


    return resp.data;
}
