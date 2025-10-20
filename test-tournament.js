// Test the tournament generation logic
function generateDynamicElimination(teams) {
  console.log(`Starting tournament with ${teams.length} teams:`, teams.map(t => t.teamName));
  
  const matches = [];
  let teamsInCurrentRound = teams.length;
  let roundNumber = 1;

  while (teamsInCurrentRound > 1) {
    const matchesThisRound = Math.floor(teamsInCurrentRound / 2);
    console.log(`\nRound ${roundNumber}: ${teamsInCurrentRound} teams → ${matchesThisRound} matches`);
    
    for (let i = 0; i < matchesThisRound; i++) {
      const team1Index = i * 2;
      const team2Index = i * 2 + 1;
      
      let team1Name, team1Id, team2Name, team2Id;
      
      if (roundNumber === 1) {
        // First round: Use actual team data
        team1Name = teams[team1Index]?.teamName || "TBA";
        team1Id = teams[team1Index]?.id || "";
        team2Name = teams[team2Index]?.teamName || "TBA";
        team2Id = teams[team2Index]?.id || "";
      } else {
        // Subsequent rounds: TBA values
        team1Name = "TBA";
        team1Id = "";
        team2Name = "TBA";
        team2Id = "";
      }

      // Determine match type based on teams remaining after this round
      const teamsAfterRound = teamsInCurrentRound - matchesThisRound;
      let matchType;
      
      if (teamsAfterRound === 1) {
        matchType = "FINAL";
      } else if (teamsAfterRound <= 2) {
        matchType = "SEMIFINAL";
      } else {
        matchType = "NONE";
      }

      const match = {
        id: `match-${roundNumber}-${i + 1}`,
        team1: team1Name,
        team2: team2Name,
        team1Id: team1Id,
        team2Id: team2Id,
        team1Score: 0,
        team2Score: 0,
        winner: "TBA",
        address: "",
        gameDate: "",
        gameTime: "",
        matchType: matchType,
        round: roundNumber
      };

      matches.push(match);
      console.log(`  Match ${i + 1}: ${team1Name} vs ${team2Name} (${matchType})`);
    }

    // Handle bye (odd number of teams)
    if (teamsInCurrentRound % 2 === 1) {
      const byeTeamIndex = teamsInCurrentRound - 1;
      let byeTeamName, byeTeamId;
      
      if (roundNumber === 1) {
        byeTeamName = teams[byeTeamIndex]?.teamName || "TBA";
        byeTeamId = teams[byeTeamIndex]?.id || "";
      } else {
        byeTeamName = "TBA";
        byeTeamId = "";
      }
      
      console.log(`  Bye: ${byeTeamName} advances automatically`);
      teamsInCurrentRound = matchesThisRound + 1; // +1 for bye
    } else {
      teamsInCurrentRound = matchesThisRound;
    }

    roundNumber++;
  }

  console.log(`\nFinal tournament structure: ${matches.length} total matches, ${roundNumber - 1} rounds`);
  return matches;
}

// Test with 10 teams
const testTeams = [
  { id: "1", teamName: "Team A" },
  { id: "2", teamName: "Team B" },
  { id: "3", teamName: "Team C" },
  { id: "4", teamName: "Team D" },
  { id: "5", teamName: "Team E" },
  { id: "6", teamName: "Team F" },
  { id: "7", teamName: "Team G" },
  { id: "8", teamName: "Team H" },
  { id: "9", teamName: "Team I" },
  { id: "10", teamName: "Team J" }
];

const result = generateDynamicElimination(testTeams);
console.log("\n=== FINAL RESULT ===");
result.forEach((match, index) => {
  console.log(`${index + 1}. Round ${match.round}: ${match.team1} vs ${match.team2} (${match.matchType})`);
});