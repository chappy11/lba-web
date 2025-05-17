import { axiosConfig } from "../config/config";
import { TeamInsertPayload } from "../dto/Team.model"

export const createTeam = async (payload:TeamInsertPayload) => {
    const resp = await axiosConfig.post("/teams",payload);
    
    return resp.data;
}

export const getCurrentTeamFromThisSeason = async () => {
  const resp = await axiosConfig.get(`/teams/current-season`)
  console.log("WEW", resp)
  return resp.data
}

export const getTeamById = async (id: string) => {
  const resp = await axiosConfig.get(`/teams?teamId=${id}`)
  return resp.data
}
