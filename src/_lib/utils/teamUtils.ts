import { v4 as uuidv4 } from "uuid";

import {
  GameType,
  Match,
  MatchType,
  Round,
  Standing,
  Team,
} from "../dto/MatchSchedule"




export function generateRoundRobinSchedule(teams: Team[]): Round[] {
  // Clone the teams array to avoid mutating the original
  const teamList = [...teams]

  // Add a "BYE" team if odd number of teams
  if (teamList.length % 2 !== 0) {
    teamList.push({
      teamId: "bye",
      teamName: "BYE",
      teamLogo: "BYE",
    })
  }

  const totalRounds = teamList.length - 1
  const matchesPerRound = teamList.length / 2

  const fixedTeam = teamList[0]
  const rotatingTeams = teamList.slice(1)

  const rounds: Round[] = []

  for (let round = 0; round < totalRounds; round++) {
    const matches: Match[] = []

    // Current round teams array
    const roundTeams = [fixedTeam, ...rotatingTeams]

    for (let i = 0; i < matchesPerRound; i++) {
      const home = roundTeams[i]
      const away = roundTeams[roundTeams.length - 1 - i]

      // Skip matches involving the "BYE" team
      if (home.teamId === "bye" || away.teamId === "bye") {
        continue
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
        matchType: MatchType.SEMIFINAL,
        gameType: GameType.ROUND_ROBIN,
        playerMvp: null,
        team1MatchScore: 0,
        team2MatchScore: 0,
        team1Logo: home.teamLogo,
        team2Logo: away.teamLogo,
      })
    }

    rounds.push({
      round: round + 1,
      matches,
    })

    // Rotate the teams (except the fixed one)
    rotatingTeams.unshift(rotatingTeams.pop()!)
  }

  return rounds
}

export function getStandings(rounds: Round[]): Standing[] {
  const standingsMap: Record<string, Standing> = {}

  // Step 1: Extract all teams from matches
  rounds.forEach((round) => {
    round.matches.forEach((match) => {
      if (!standingsMap[match.team1Id]) {
        standingsMap[match.team1Id] = {
          teamId: match.team1Id,
          teamName: match.team1,
          teamLogo: match.team1Logo || "",
          wins: 0,
          losses: 0,
          goalsFor: 0,
        }
      }
      if (!standingsMap[match.team2Id]) {
        standingsMap[match.team2Id] = {
          teamId: match.team2Id,
          teamName: match.team2,
          wins: 0,
          losses: 0,
          goalsFor: 0,
          teamLogo: match.team2Logo || "",
        }
      }
    })
  })

  // Step 2: Process all matches
  rounds.forEach((round) => {
    round.matches.forEach((match) => {
      const team1 = standingsMap[match.team1Id]
      const team2 = standingsMap[match.team2Id]

      // Goals
      team1.goalsFor += match.team1Score

      team2.goalsFor += match.team2Score

      // Result
      if (match.team1Score > match.team2Score) {
        team1.wins += 1
        team2.losses += 1
      } else if (match.team1Score < match.team2Score) {
        team2.wins += 1
        team1.losses += 1
      }
    })
  })

  // Step 3: Calculate GD

  // Step 4: Sort standings by wins → goalsFor
  return Object.values(standingsMap).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins // Wins descending
    if (a.losses !== b.losses) return a.losses - b.losses // Losses ascending
    return b.goalsFor - a.goalsFor // Goals For descending
  })
}

export function singleElimation(teams: Standing[]) {
  // Sort by wins then score
  const topTeams = teams.slice(0, 4)

  // Bracket pairing
  const arrayOfBracket: Match[] = [
    {
      id: uuidv4(),
      team1: topTeams[0]?.teamName,
      team2: topTeams[2]?.teamName,
      team1Id: topTeams[0]?.teamId,
      team2Id: topTeams[2]?.teamId,
      team1Score: 0,
      team2Score: 0,
      winner: "TBA",
      address: "TBA",
      gameDate: "TBA",
      gameTime: "TBA",
      matchType: MatchType.SEMIFINAL,
      gameType: GameType.ELIMINATION,
      playerMvp: null,
      team1MatchScore: 0,
      team2MatchScore: 0,
      team1Logo: topTeams[0]?.teamLogo,
      team2Logo: topTeams[2]?.teamLogo,
    },
    {
      id: uuidv4(),
      team1: topTeams[1]?.teamName,
      team2: topTeams[3]?.teamName,
      team1Id: topTeams[1]?.teamId,
      team2Id: topTeams[3]?.teamId,
      team1Score: 0,
      team2Score: 0,
      winner: "TBA",
      address: "TBA",
      gameDate: "TBA",
      gameTime: "TBA",
      matchType: MatchType.SEMIFINAL,
      gameType: GameType.ELIMINATION,
      playerMvp: null,
      team1MatchScore: 0,
      team2MatchScore: 0,
      team1Logo: topTeams[1]?.teamLogo,
      team2Logo: topTeams[3]?.teamLogo,
    },
    {
      id: uuidv4(),
      team1: "",
      team2: "",
      team1Id: "",
      team2Id: "",
      team1Score: 0,
      team2Score: 0,
      winner: "TBA",
      address: "TBA",
      gameDate: "TBA",
      gameTime: "TBA",
      matchType: MatchType.FINAL,
      gameType: GameType.ELIMINATION,
      playerMvp: null,
      team1MatchScore: 0,
      team2MatchScore: 0,
      team1Logo: "",
      team2Logo: "",
    },
  ]

  return arrayOfBracket
}
