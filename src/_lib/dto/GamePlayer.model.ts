import { GameTeamInfo } from "./Game.model";
import { Player } from "./Player.model";

export type PlayerGameInfo = Pick<Player,'id'|'firstname'|'middlename'|'lastname'>


export interface GamePlayer {
    id:string;
    team:GameTeamInfo
    gameId:string;
    seasonId:string;
    player:PlayerGameInfo
    points:number;
    rebound:number;
    assist:number;
    threepoints:number;
    aces:number;
    kills:number;
    blocks:number;
    foul:number;
}


export type GamePlayerInfoPayload = Omit<GamePlayer,'id'>