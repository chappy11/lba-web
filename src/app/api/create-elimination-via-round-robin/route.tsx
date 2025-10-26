import { CreateMatchSchedule, GameType, Round } from "@/_lib/dto/MatchSchedule"
import { Team } from "@/_lib/dto/Team.model"
import { FirebaseCollection } from "@/_lib/enums/FirebaseCollection.enum"
import { getActiveSeason } from "@/_lib/services/SeasonService.service"
import { getTeamFromThisSeason } from "@/_lib/services/TeamService.service"
import { addCollection } from "@/_lib/utils/firebase.utils"
import { generateDynamicElimination, getStandings } from "@/_lib/utils/teamUtils"
import { NextResponse } from "next/server"

export async function POST(request:Request) {
    try {
          const body = (await request.json()) as unknown as Round[]
          const season = await getActiveSeason()
          if (!season) {
            throw new Error("No active season found")
          }

          console.log("Creating elimination matches via round robin:", body)
          const standing = await getStandings(body)

          const top4Teams = standing.slice(0, 4)
          console.log("Top 4 teams from round robin standings:", top4Teams)

          const teams = (await getTeamFromThisSeason()) as unknown as Team[]
          const top4TeamDetails = top4Teams.map((standing) => {
            const team = teams.find((team) => team.id === standing.teamId)
            return {
              ...standing,
              team: team ? { ...team } : null,
            }
          })
        console.log("Top 4 team details:", top4TeamDetails)

        if (top4Teams.length < 2) {
          throw new Error(
            "At least 2 teams are required for elimination tournament"
          )
        }

         console.log("=== CREATING ELIMINATION BRACKET FOR TOP 4 TEAMS ===")
            console.log(
              `Creating bracket structure for top ${top4Teams.length} teams`
            )
        
            // Create properly seeded teams: 1st vs 4th, 2nd vs 3rd
            const seededTeams = [
              // 1st place team
              {
                teamId: top4TeamDetails[0]?.team?.id || 'tba-1',
                teamName: top4TeamDetails[0]?.team?.teamName || 'TBA',
                teamLogo: top4TeamDetails[0]?.team?.teamLogo || ''
              },
              // 4th place team
              {
                teamId: top4TeamDetails[3]?.team?.id || 'tba-4',
                teamName: top4TeamDetails[3]?.team?.teamName || 'TBA',
                teamLogo: top4TeamDetails[3]?.team?.teamLogo || ''
              },
              // 2nd place team
              {
                teamId: top4TeamDetails[1]?.team?.id || 'tba-2',
                teamName: top4TeamDetails[1]?.team?.teamName || 'TBA',
                teamLogo: top4TeamDetails[1]?.team?.teamLogo || ''
              },
              // 3rd place team
              {
                teamId: top4TeamDetails[2]?.team?.id || 'tba-3',
                teamName: top4TeamDetails[2]?.team?.teamName || 'TBA',
                teamLogo: top4TeamDetails[2]?.team?.teamLogo || ''
              }
            ]
        
            console.log("Seeded bracket matchups:")
            console.log(`Semifinal 1: ${seededTeams[0].teamName} (1st) vs ${seededTeams[1].teamName} (4th)`)
            console.log(`Semifinal 2: ${seededTeams[2].teamName} (2nd) vs ${seededTeams[3].teamName} (3rd)`)
        
            // Generate the elimination bracket using the seeded teams
            const eliminationMatches = generateDynamicElimination(seededTeams)
        
            // Organize matches into proper rounds based on logical progression
            const rounds: Round[] = []
        
            // For 4 teams: should have exactly 2 rounds (Semifinal + Final)
            const tournamentTeamCount = 4
            let currentTeamCount = tournamentTeamCount
            let expectedRounds = 0
            while (currentTeamCount > 1) {
              expectedRounds++
              currentTeamCount = Math.floor(currentTeamCount / 2)
            }
        
            console.log(`Expected ${expectedRounds} rounds for top ${tournamentTeamCount} teams`)
        
            // Group matches by rounds based on the bracket structure
            let matchIndex = 0
            let teamsRemaining = tournamentTeamCount
        
            for (let roundNum = 1; roundNum <= expectedRounds; roundNum++) {
              const matchesInRound = Math.floor(teamsRemaining / 2)
        
              // Get matches for this specific round
              const roundMatches = eliminationMatches.slice(
                matchIndex,
                matchIndex + matchesInRound
              )
        
              if (roundMatches.length > 0) {
                rounds.push({
                  round: roundNum,
                  matches: roundMatches,
                })
        
                console.log(
                  `Round ${roundNum}: ${roundMatches.length} matches (${teamsRemaining} → ${matchesInRound} advance)`
                )
              }
        
              matchIndex += matchesInRound
              teamsRemaining = matchesInRound
            }
        
            // Create the match schedule payload
            const createMatchesPayload: CreateMatchSchedule = {
              done: false,
              seasonId: season.id,
              matchType: GameType.ELIMINATION,
              matchSchedule: rounds,
            }
        
            // Save to Firestore
            const resp = await addCollection(
              FirebaseCollection.MATCH_SCHEDULE,
              createMatchesPayload
            )
        
            const matchScheduleId = resp.id
        
            // Calculate tournament info for response
            const totalMatches = eliminationMatches.length
            const totalRounds = rounds.length
        
            return NextResponse.json({
              success: true,
              matchScheduleId,
              totalMatches,
              totalRounds,
              teamCount: 4,
              top4Teams: top4Teams.map(t => ({ teamId: t.teamId, teamName: t.teamName, wins: t.wins })),
              message: `Successfully created elimination tournament with ${totalMatches} matches across ${totalRounds} rounds for top 4 teams from round-robin`,
            })
        
        
    } catch (error) {
        console.error("Error creating elimination via round robin:", error)
        return new Response("Internal Server Error", { status: 500 })
    }

}
