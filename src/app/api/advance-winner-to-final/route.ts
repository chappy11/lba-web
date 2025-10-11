import { advanceWinnerToFinal } from "@/_lib/services/MatchSchedule.service"
import { NextResponse } from "next/server"

/**
 * POST /api/advance-winner-to-final
 * 
 * Manually advances a specific semifinal winner to a designated slot in the final match.
 * 
 * @body {Object} Request body
 * @body {string} semifinalMatchId - The ID of the semifinal match
 * @body {1 | 2} finalSlot - Which team slot in the final (1 for team1, 2 for team2)
 * 
 * @returns {Object} Success status and winner information
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { semifinalMatchId, finalSlot } = body

    // Validate inputs
    if (!semifinalMatchId) {
      return NextResponse.json(
        {
          success: false,
          message: "semifinalMatchId is required",
        },
        { status: 400 }
      )
    }

    if (finalSlot !== 1 && finalSlot !== 2) {
      return NextResponse.json(
        {
          success: false,
          message: "finalSlot must be either 1 or 2",
        },
        { status: 400 }
      )
    }

    const result = await advanceWinnerToFinal(
      semifinalMatchId,
      finalSlot as 1 | 2
    )

    return NextResponse.json(
      {
        success: true,
        message: `Winner advanced to final (team ${finalSlot})`,
        data: result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error advancing winner to final:", error)
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to advance winner",
        error: String(error),
      },
      { status: 500 }
    )
  }
}
