import { Player } from "./Player.model";

export type PlayerGameInfo = Pick<
	Player,
	| "id"
	| "firstname"
	| "middlename"
	| "lastname"
>;

export interface GamePlayer {
	playerId: string;
	firstname: string;
	middlename: string;
	lastname: string;
	points: number;
	rebound: number;
	assist: number;
	threepoints: number;
	foul: number;
}

export type GamePlayerInfoPayload =
	Omit<GamePlayer, "id">;
