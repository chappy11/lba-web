import { calculateTeamStatistics } from "@/_lib/services/MatchSchedule.service"
import { NextResponse } from "next/server"

/**
 * GET /api/team-statistics
 * 
 * Calculates comprehensive team statistics from all match schedules and results.
 * Includes wins, losses, games played, goals for/against, and rankings.
 * 
 * @returns {Object} Team statistics for all teams with computed wins and losses
 */
export async function GET() {
  try {
    const result = await calculateTeamStatistics()

    return NextResponse.json(
      {
        success: true,
        message: "Team statistics calculated successfully",
        data: result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error calculating team statistics:", error)
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to calculate statistics",
        error: String(error),
      },
      { status: 500 }
    )
  }
}
