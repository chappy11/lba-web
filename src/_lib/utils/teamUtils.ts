import { v4 as uuidv4 } from "uuid";

type Standing = {
	teamId: string;
	teamName: string;
	wins: number;
	losses: number;
	goalsFor: number;
};

type Team = {
	teamId: string;
	teamName: string;
};

type Match = {
	id: string;
	team1: string;
	team2: string;
	team1Id: string;
	team2Id: string;
	team1Score: number;
	team2Score: number;
	winner: string;
	address: string;
	gameDate: string;
	gameTime: string;
	matchType: MatchType;
	isElimination: boolean;
};

type Round = {
	round: number;
	matches: Match[];
};

export enum MatchType {
	ROUND_ROBIN = "ROUND_ROBIN",
	SEMIFINAL = "SEMIFINAL",
	FINAL = "FINAL",
}

type ElimanationTeam = {
	matchId: string;
	mathcType: MatchType;
	teamOneId: string | null;
	teamOneName: string;
	teamOneScore: number;
	teamOneWins: number;
	teamTwoId: string | null;
	teamTwoName: string;
	teamTwoScore: number;
	teamTwoWins: number;
	winner: string;
};

export function generateRoundRobinSchedule(
	teams: Team[]
): Round[] {
	// Clone the teams array to avoid mutating the original
	const teamList = [...teams];

	// Add a "BYE" team if odd number of teams
	if (teamList.length % 2 !== 0) {
		teamList.push({
			teamId: "bye",
			teamName: "BYE",
		});
	}

	const totalRounds =
		teamList.length - 1;
	const matchesPerRound =
		teamList.length / 2;

	const fixedTeam = teamList[0];
	const rotatingTeams =
		teamList.slice(1);

	const rounds: Round[] = [];

	for (
		let round = 0;
		round < totalRounds;
		round++
	) {
		const matches: Match[] = [];

		// Current round teams array
		const roundTeams = [
			fixedTeam,
			...rotatingTeams,
		];

		for (
			let i = 0;
			i < matchesPerRound;
			i++
		) {
			const home = roundTeams[i];
			const away =
				roundTeams[
					roundTeams.length - 1 - i
				];

			// Skip matches involving the "BYE" team
			if (
				home.teamId === "bye" ||
				away.teamId === "bye"
			) {
				continue;
			}

			matches.push({
				id: uuidv4(),
				team1: home.teamName,
				team2: away.teamName,
				team1Id: home.teamId,
				team2Id: away.teamId,
				team1Score: 0,
				team2Score: 0,
				winner: "TBA",
				address: "TBA",
				gameDate: "TBA",
				gameTime: "TBA",
			});
		}

		rounds.push({
			round: round + 1,
			matches,
		});

		// Rotate the teams (except the fixed one)
		rotatingTeams.unshift(
			rotatingTeams.pop()!
		);
	}

	return rounds;
}

export function getStandings(
	rounds: Round[]
): Standing[] {
	const standingsMap: Record<
		string,
		Standing
	> = {};

	// Step 1: Extract all teams from matches
	rounds.forEach((round) => {
		round.matches.forEach((match) => {
			if (
				!standingsMap[match.team1Id]
			) {
				standingsMap[match.team1Id] = {
					teamId: match.team1Id,
					teamName: match.team1,

					wins: 0,

					losses: 0,
					goalsFor: 0,
				};
			}
			if (
				!standingsMap[match.team2Id]
			) {
				standingsMap[match.team2Id] = {
					teamId: match.team2Id,
					teamName: match.team2,
					wins: 0,
					losses: 0,
					goalsFor: 0,
				};
			}
		});
	});

	// Step 2: Process all matches
	rounds.forEach((round) => {
		round.matches.forEach((match) => {
			const team1 =
				standingsMap[match.team1Id];
			const team2 =
				standingsMap[match.team2Id];

			// Goals
			team1.goalsFor +=
				match.team1Score;

			team2.goalsFor +=
				match.team2Score;

			// Result
			if (
				match.team1Score >
				match.team2Score
			) {
				team1.wins += 1;
				team2.losses += 1;
			} else if (
				match.team1Score <
				match.team2Score
			) {
				team2.wins += 1;
				team1.losses += 1;
			}
		});
	});

	// Step 3: Calculate GD

	// Step 4: Sort standings by wins → goalsFor
	return Object.values(
		standingsMap
	).sort((a, b) => {
		if (b.wins !== a.wins)
			return b.wins - a.wins; // Wins first
		return b.goalsFor - a.goalsFor; // Then total goals scored
	});
}

export function singleElimation(
	teams: Standing[]
) {
	// Sort by wins then score
	const topTeams = teams.slice(0, 4);

	// Bracket pairing
	const arrayOfBracket: ElimanationTeam[] =
		[
			{
				matchId: uuidv4(),
				mathcType: MatchType.SEMIFINAL,
				teamOneId: topTeams[0].teamId,
				teamOneName:
					topTeams[0].teamName,
				teamOneScore: 0,
				teamOneWins: 0,
				teamTwoId: topTeams[2].teamId,
				teamTwoName:
					topTeams[2].teamName,
				teamTwoScore: 0,
				teamTwoWins: 0,
				winner: "",
			},
			{
				matchId: uuidv4(),
				mathcType: MatchType.SEMIFINAL,
				teamOneId: topTeams[0].teamId,
				teamOneName:
					topTeams[0].teamName,
				teamOneScore: 0,
				teamOneWins: 0,
				teamTwoId: topTeams[2].teamId,
				teamTwoName:
					topTeams[2].teamName,
				teamTwoScore: 0,
				teamTwoWins: 0,
				winner: "",
			},
			{
				matchId: uuidv4(),
				mathcType: MatchType.FINAL,
				teamOneId: null,
				teamOneName: "",
				teamOneScore: 0,
				teamOneWins: 0,
				teamTwoId: null,
				teamTwoName: "",
				teamTwoScore: 0,
				teamTwoWins: 0,
				winner: "",
			},
		];
}

const teams = [
	{
		name: "Alpha",
		wins: 5,
		score: 120,
	},
	{ name: "Beta", wins: 4, score: 150 },
	{
		name: "Gamma",
		wins: 4,
		score: 140,
	},
	{
		name: "Delta",
		wins: 3,
		score: 160,
	},
	{
		name: "Epsilon",
		wins: 2,
		score: 130,
	},
	{ name: "Zeta", wins: 1, score: 110 },
];
