import { TeamInsertPayload, UpdateTeam } from "@/_lib/dto/Team.model"

import {
  getTeamById,
  insertTeam,
  udpateTeamById,
} from "@/_lib/services/TeamService.service"

import { NextResponse } from "next/server"

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

    if (teamId) {
      // Get specific team
      const seasonTeam = await getTeamById(teamId as string)
      return NextResponse.json(seasonTeam, { status: 200 })
    } else {
      // Get all teams from current season
      const { getTeamFromThisSeason } = await import(
        "@/_lib/services/TeamService.service"
      )
      const allTeams = await getTeamFromThisSeason()

      return NextResponse.json(
        {
          success: true,
          data: allTeams,
          message: "Teams retrieved successfully",
        },
        { status: 200 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get teams",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get("teamId")
    const body = (await request.json()) as unknown as UpdateTeam

    const resp = await udpateTeamById(teamId as string, body)

    return NextResponse.json(
      { message: "Successfully Updated", data: resp },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
