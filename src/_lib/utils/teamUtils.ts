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

/**
 * Generate dynamic single elimination bracket for any number of teams
 * Handles complex scenarios like 10 teams with proper round organization
 * 
 * @param teams - Array of teams to include in bracket
 * @returns Array of matches for the entire elimination tournament
 */
export function generateDynamicElimination(teams: Team[]): Match[] {
  const teamCount = teams.length
  
  if (teamCount < 2) {
    throw new Error("At least 2 teams are required for elimination bracket")
  }

  console.log(`=== GENERATING DYNAMIC ELIMINATION FOR ${teamCount} TEAMS ===`)

  const allMatches: Match[] = []
  let teamsInCurrentRound = teamCount
  let roundNumber = 1

  // Generate all rounds from first to final
  while (teamsInCurrentRound > 1) {
    const matchesThisRound = Math.floor(teamsInCurrentRound / 2)
    const byesThisRound = teamsInCurrentRound % 2
    
    console.log(`Round ${roundNumber}: ${teamsInCurrentRound} teams → ${matchesThisRound} matches, ${byesThisRound} bye`)

    // Determine match type based on teams remaining after this round
    const teamsAfterRound = matchesThisRound + byesThisRound
    let matchType: MatchType
    
    if (teamsAfterRound === 1) {
      matchType = MatchType.FINAL
    } else if (teamsAfterRound === 2) {
      matchType = MatchType.SEMIFINAL
    } else {
      matchType = MatchType.NONE
    }

    // Create matches for this round
    for (let i = 0; i < matchesThisRound; i++) {
      let team1Name = ""
      let team2Name = ""
      let team1Id = ""
      let team2Id = ""
      let team1Logo = ""
      let team2Logo = ""

      // First round: Use actual team data
      if (roundNumber === 1) {
        const team1Index = i * 2
        const team2Index = i * 2 + 1
        
        if (team1Index < teams.length) {
          team1Name = teams[team1Index].teamName
          team1Id = teams[team1Index].teamId
          team1Logo = teams[team1Index].teamLogo
        }
        
        if (team2Index < teams.length) {
          team2Name = teams[team2Index].teamName
          team2Id = teams[team2Index].teamId
          team2Logo = teams[team2Index].teamLogo
        }
      } else {
        // Subsequent rounds: Use TBA values that will be populated by winners
        team1Name = "TBA"
        team2Name = "TBA"
        team1Id = ""
        team2Id = ""
        team1Logo = ""
        team2Logo = ""
      }
      
      const match: Match = {
        id: uuidv4(),
        team1: team1Name,
        team2: team2Name,
        team1Id: team1Id,
        team2Id: team2Id,
        team1Score: 0,
        team2Score: 0,
        winner: "TBA",
        address: "TBA",
        gameDate: "TBA",
        gameTime: "TBA",
        matchType: matchType,
        gameType: GameType.ELIMINATION,
        playerMvp: null,
        team1MatchScore: 0,
        team2MatchScore: 0,
        team1Logo: team1Logo,
        team2Logo: team2Logo,
      }
      
      allMatches.push(match)
    }

    // Calculate teams for next round
    teamsInCurrentRound = matchesThisRound + byesThisRound
    roundNumber++
  }

  console.log(`Generated ${allMatches.length} total matches across ${roundNumber - 1} rounds`)
  
  // Log the structure for debugging
  console.log("Match structure:")
  let currentRound = 1
  let matchIndex = 0
  let teamsThisRound = teamCount
  
  while (teamsThisRound > 1) {
    const matchesInRound = Math.floor(teamsThisRound / 2)
    const byesInRound = teamsThisRound % 2
    
    console.log(`  Round ${currentRound}: ${matchesInRound} matches (${teamsThisRound} teams → ${matchesInRound + byesInRound} advance)`)
    
    for (let i = 0; i < matchesInRound; i++) {
      const match = allMatches[matchIndex + i]
      console.log(`    Match ${matchIndex + i + 1}: ${match.team1} vs ${match.team2} (${match.matchType})`)
    }
    
    if (byesInRound > 0) {
      console.log(`    1 team gets bye`)
    }
    
    matchIndex += matchesInRound
    teamsThisRound = matchesInRound + byesInRound
    currentRound++
  }
  
  console.log("=== END DYNAMIC ELIMINATION GENERATION ===")

  return allMatches
}
