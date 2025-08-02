import { axiosConfig } from "../config/config";
import { TeamInsertPayload } from "../dto/Team.model";

export const createTeam = async (payload: TeamInsertPayload) => {
  try {
    const resp = await axiosConfig.post("/teams", payload)

    return resp.data
  } catch (error) {
    console.log("Error creating team:", error)
    return null
  }
}

export const getCurrentTeamFromThisSeason = async () => {
  try {
    const resp = await axiosConfig.get(`/teams/current-season`)

    return resp.data
  } catch (error) {
    console.error("Error fetching current team:", error)
    return null
  }
}

export const getTeamById = async (id: string) => {
  try {
    const resp = await axiosConfig.get(`/teams?teamId=${id}`)
    return resp.data
  } catch (error) {
    console.error("Error fetching team by ID:", error)
    return null
  }
}

export const getTeamStandingThisSeason = async () => {
  try {
    const resp = await axiosConfig.get(`/standing`)
    return resp.data
  } catch (error) {
    console.error("Error fetching team standing:", error)
    return null
  }
}
	

