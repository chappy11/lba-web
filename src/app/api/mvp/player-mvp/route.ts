import { getPlayerMvpByPlayerId } from "@/_lib/services/PlayerMvp.service"

import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
   
   
      const playerId = searchParams.get("playerId")
    if (!playerId) {
      return NextResponse.json(
        { message: "Player Id is required" },
        { status: 400 }
      )
    }
    const playerData = await getPlayerMvpByPlayerId(playerId)
    return NextResponse.json(playerData, { status: 200 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
