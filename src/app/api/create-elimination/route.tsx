import { createEliminationMatchRound } from "@/_lib/services/MatchSchedule.service"
import { NextResponse } from "next/server"


export async function POST() {
  try {
    const result = await createEliminationMatchRound()

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
