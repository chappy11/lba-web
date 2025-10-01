import { Player } from "./Player.model";

export type PlayerMvp =  Omit<Player, 'id'> &{
    id: string;
    gameId: string;
    dateCreated: string;
    dateUpdated: string;
    seasonId: string;
    playerId: string;
}


export type GetPlayerMvpResponse = Omit<PlayerMvp, 'id'>

export type CreatePlayerPlayload = Omit<PlayerMvp, "id" | "seasonId" |"dateCreated" | "dateUpdated">

export type CreatePlayerPlayloadToDb = Omit<PlayerMvp, "id">