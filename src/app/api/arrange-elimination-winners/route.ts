import { arrangeEliminationWinners } from "@/_lib/services/MatchSchedule.service"
import { NextResponse } from "next/server"

/**
 * POST /api/arrange-elimination-winners
 * 
 * Automatically arranges winners in elimination matches based on total scores.
 * Processes all semifinal matches, determines winners, and advances them to the final.
 * 
 * @returns {Object} Success status, semifinal winners, and updated schedule
 */
export async function POST() {
  try {
    const result = await arrangeEliminationWinners()

    return NextResponse.json(
      {
        success: true,
        message: "Winners arranged successfully",
        data: result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error arranging elimination winners:", error)
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to arrange winners",
        error: String(error),
      },
      { status: 500 }
    )
  }
}
