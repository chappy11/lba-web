import { axiosConfig } from "../config/config";

export const getMatchSchedule = async () => { 
    const resp = await axiosConfig.get("/teams/round-robin");

    return resp.data;
}

export const createMatchSchedule = async () => {
    const resp = await axiosConfig.post("/teams/round-robin");

    return resp.data;
}