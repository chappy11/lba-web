export type MatchTeam = {
    id: string;
    team1: string;
    team2: string;
    team1Id: string;
    team2Id: string;
    team1Score: number;
    team2Score: number;
    winner: string;
    address: string;
}

export type MatchRound = {
    round: number;
    matches: MatchTeam[];
}

export type MatchSchedule = Array<MatchRound>; 

export type SeasonGames = {
    id: string;
    done: boolean;
    matchSchedule: Array<MatchRound>;
}


export type CreateMatchSchedule = Omit<SeasonGames, "id">;