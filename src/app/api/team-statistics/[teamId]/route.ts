import { getTeamStatistics } from "@/_lib/services/MatchSchedule.service"
import { NextResponse } from "next/server"

/**
 * GET /api/team-statistics/[teamId]
 * 
 * Gets statistics for a specific team including rank and performance metrics.
 * 
 * @param {Object} context - Request context
 * @param {Object} context.params - Route parameters
 * @param {string} context.params.teamId - The team ID
 * 
 * @returns {Object} Statistics for the specified team
 */
export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { teamId } = params

    if (!teamId) {
      return NextResponse.json(
        {
          success: false,
          message: "Team ID is required",
        },
        { status: 400 }
      )
    }

    const result = await getTeamStatistics(teamId)

    return NextResponse.json(
      {
        success: true,
        message: "Team statistics retrieved successfully",
        data: result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error getting team statistics:", error)
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to get team statistics",
        error: String(error),
      },
      { status: 500 }
    )
  }
}
