import { getTeamFromThisSeason } from "@/_lib/services/TeamService.service"

import { NextResponse } from "next/server"

export async function GET() {
  try {
    const seasonTeam = await getTeamFromThisSeason()

    return NextResponse.json(seasonTeam, { status: 200 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
