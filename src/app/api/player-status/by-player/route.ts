import { getPlayerStatusByPlayerId } from "@/_lib/services/PlayerScore.service"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const playerId = searchParams.get("playerId")

    if (!playerId) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      )
    }

    const playerScores = await getPlayerStatusByPlayerId(playerId)

    return NextResponse.json(playerScores, { status: 200 })
  } catch (error) {
    console.error("Error fetching player scores:", error)
    return NextResponse.json(
      { error: "Failed to fetch player scores" },
      { status: 500 }
    )
  }
}
