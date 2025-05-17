import { TeamInsertPayload } from "@/_lib/dto/Team.model";
import { getTeamById, insertTeam } from "@/_lib/services/TeamService.service"

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown as TeamInsertPayload

    const resp = await insertTeam(body)

    return NextResponse.json(
      { message: "Successfully Added", data: resp },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get("teamId")

    const seasonTeam = await getTeamById(teamId as string)

    return NextResponse.json(seasonTeam, { status: 200 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
