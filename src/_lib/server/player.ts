import { axiosConfig } from "../config/config";
import { Player } from "../dto/Player.model";

export const createPlayer = async (player:Player) => {
    const resp = await axiosConfig.post("/players",player);
    
    return resp.data;
}


export const getPlayerByTeams = async (teamId:string) => {
    const resp = await axiosConfig.get(`/players?teamId=${teamId}`)

    return resp.data;
}