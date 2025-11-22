import { updateSeasonWithMvp } from "@/_lib/services/SeasonService.service"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const seasonId = searchParams.get("seasonId")

    if (!seasonId) {
      return NextResponse.json(
        { error: "Season ID is required" },
        { status: 400 }
      )
    }

    const result = await updateSeasonWithMvp(seasonId)

    return NextResponse.json({
      success: true,
      message: "Season updated with MVP successfully",
      data: result,
    })
  } catch (error) {
    console.error("Error in update-mvp API:", error)
    return NextResponse.json(
      {
        error: "Failed to update season with MVP",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
