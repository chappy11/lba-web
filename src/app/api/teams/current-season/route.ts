import { GameType } from "@/_lib/enums/GameTypeEnum"
import { getTeamFromThisSeason } from "@/_lib/services/TeamService.service"


import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const gameType = searchParams.get("gameType")
    if (!gameType) {
      return NextResponse.json("Something went wrong", { status: 500 })
    }
    const seasonTeam = await getTeamFromThisSeason(gameType as GameType)

    return NextResponse.json(seasonTeam, { status: 200 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
