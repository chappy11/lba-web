import { getEliminationTournamentData } from "@/_lib/server/matchSchedule"
import { getAllTeamsForAssignment } from "@/_lib/server/team"
import TeamSelectionSheet from "@/feature/MatchSchedule/TeamSelectionSheet"

export default async function TeamAssignmentPage() {
  // Fetch data on the server side
  const [tournamentData, teamsData] = await Promise.all([
    getEliminationTournamentData(),
    getAllTeamsForAssignment()
  ])

  return (
    <TeamSelectionSheet 
      initialTournamentData={tournamentData}
      initialTeamsData={teamsData}
    />
  )
}