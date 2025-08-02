import { CreateMatchSchedule } from "../dto/MatchSchedule"
import { Team } from "../dto/Team.model"
import { FirebaseCollection } from "../enums/FirebaseCollection.enum"
import { GetFirebaseDataPayload } from "../type/firebaseType.type"
import { addCollection, getData } from "../utils/firebase.utils"
import { generateRoundRobinSchedule } from "../utils/teamUtils"


import { getTeamFromThisSeason } from "./TeamService.service"

export async function createSchedule() {
    try {
        const matches = await roundRobin()
    
        const createMatchesPayload: CreateMatchSchedule = {
            done: false,
            matchSchedule: matches,
        }

        console.log(JSON.stringify(createMatchesPayload, null, 2))

        const resp = await addCollection(FirebaseCollection.MATCH_SCHEDULE, createMatchesPayload);
        
        return resp.id;
    } catch (error) {
        console.error("Error creating schedule:", error)
        throw new Error("Failed to create schedule")
    }
}

export async function getMatchSchedule() {
    try {
           const payload: GetFirebaseDataPayload =
                {
                    firebaseCollection:
                        FirebaseCollection.MATCH_SCHEDULE,
                  filter:[]
           };
        
        
        const resp = await getData(payload);
        
        return resp;

    } catch (error) {
        throw new Error("Something went wrong while fetching match schedule ")
    }
}

 export async function roundRobin() {
  const teams = (await getTeamFromThisSeason()) as unknown as Team[]

  if (teams.length < 1) {
    throw new Error("No teams found for the current season")
  }

  const inputTeams = teams.map((team) => ({
    teamId: team.id as string,
    teamName: team.teamName,
  }))

  const matches = await generateRoundRobinSchedule(inputTeams)

  return matches
}

