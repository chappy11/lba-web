import { v4 as uuidv4 } from "uuid";

type Props = Array<Team>;

// export function generateCustomRoundRobinMatches(teams: Props) {
//   const isOdd = teams.length % 2 !== 0
//   const teamList = [...teams]

//   if (isOdd) {
//     teamList.push({ teamId: "BYE", teamName: "BYE" })
//   }

//   const numRounds = teamList.length - 1
//   const halfSize = teamList.length / 2

//   const schedule = []

//   // Create rotating array (excluding first team)
//   const fixedTeam = teamList[0]
//   const rotatingTeams = teamList.slice(1)

//   for (let round = 0; round < numRounds; round++) {
//     const roundMatches = []

//     const currentRoundTeams = [fixedTeam, ...rotatingTeams]

//     for (let i = 0; i < halfSize; i++) {
//       const team1 = currentRoundTeams[i]
//       const team2 = currentRoundTeams[currentRoundTeams.length - 1 - i]

//       if (team1.teamName !== "BYE" && team2.teamName !== "BYE") {
//         roundMatches.push({
//           id: uuidv4(),
//           team1: team1.teamName,
//           team2: team2.teamName,
//           team1Id: team1.teamId,
//           team2Id: team2.teamId,
//           team1Score: 0,
//           team2Score: 0,
//           winner: "TBA",
//           address: "TBA",
//         })
//       }
//     }

//     schedule.push({
//       round: round + 1,
//       matches: roundMatches,
//     })

//     // 🔁 Proper rotation: move last element to front (clockwise)
//     rotatingTeams.unshift(rotatingTeams.pop()!)
//   }

//   return schedule
// }

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
};

type Round = {
	round: number;
	matches: Match[];
};

// export function generateUniqueMatchups(teams: Team[]): Match[] {
//   const rounds: Round[] = []
//   let matchNumber = 0

//   for (let i = 0; i < teams.length; i++) {
//     for (let j = i + 1; j < teams.length; j++) {
//       const team1 = teams[i]
//       const team2 = teams[j]

//       const match: Match = {
//         id: uuidv4(),
//         team1: team1.teamName,
//         team2: team2.teamName,
//         team1Id: team1.teamId,
//         team2Id: team2.teamId,
//         team1Score: 0,
//         team2Score: 0,
//         winner: "TBA",
//         address: "TBA",
//       }

//       matchNumber++
//       rounds.push({
//         round: matchNumber,
//         matches: [match], // single match per round
//       })
//     }
//   }

//   return rounds
// }

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
