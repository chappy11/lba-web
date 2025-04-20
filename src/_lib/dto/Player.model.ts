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

export type PlayerInsertPayload = Omit<Player, "id">;
