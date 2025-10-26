import { CreateMatchResult } from "@/_lib/dto/MatchSchedule"
import {
  createMatchResult,
  getMatchResults,
} from "@/_lib/services/MatchSchedule.service"

import { NextResponse } from "next/server"

export async function GET() {
  try {
    const matchResults = await getMatchResults()

    return NextResponse.json(matchResults, { status: 200 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown as CreateMatchResult

    const resp = await createMatchResult(body)

    return NextResponse.json(
      {
        message: "Match Result Successfully Created",
        data: resp,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
