


import { axiosConfig } from "../config/config";
import { SeasonInsertPayload } from "../dto/Season.model";

export const getSeasons = async () => {
    const resp = await axiosConfig.get("/season");
    return resp.data
}


export const createSeason = async (seasonData: SeasonInsertPayload) => { 
    const resp = await axiosConfig.post("/season", seasonData);
    return resp.data
}


export const getCurrentSeason = async() => {
    const resp = await axiosConfig.get("/season/get-active-season");

    return resp.data;
}

export const updateSeasonWithMvpApi = async (seasonId: string) => {
  const resp = await axiosConfig.put(`/season/update-mvp?seasonId=${seasonId}`)
  return resp.data
}

export const updateSeasonApi = async (
  seasonId: string,
  updates: Partial<SeasonInsertPayload>
) => {
  const resp = await axiosConfig.put(`/season?seasonId=${seasonId}`, updates)
  return resp.data
}
