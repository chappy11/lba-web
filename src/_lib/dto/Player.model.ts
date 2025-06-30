import { Team } from "./Team.model";

export interface Player {
	id?: string;
	teamId: string;
	firstname: string;
	middlename: string;
	lastname: string;
	position: string;
	age: number;
	jerseyNumber: string;
	dateCreated: string;
}

export type PlayerInsertPayload = Omit<
	Player,
	"id"
>;

export type PlayerWithTeam = Player & {
	team: Team;
};

export type PlayerResponse =
	Array<PlayerWithTeam>;
