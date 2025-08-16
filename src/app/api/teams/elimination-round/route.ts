import { GameType } from "@/_lib/dto/MatchSchedule"
import {
    createSchedule,
    getMatchSchedule,
} from "@/_lib/services/MatchSchedule.service"

import { NextResponse } from "next/server"

export async function GET() {
  try {
    const seasonTeam = await getMatchSchedule(GameType.ELIMINATION)

    return NextResponse.json(seasonTeam, { status: 200 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}

export async function POST() {
  try {
    const resp = await createSchedule(GameType.ELIMINATION)

    return NextResponse.json(resp, { status: 201 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
