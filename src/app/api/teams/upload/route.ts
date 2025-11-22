import { TeamBatchInsertPayload, } from "@/_lib/dto/Team.model"
import { createTeamByBatch } from "@/_lib/services/TeamService.service"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
     const body = (await request.json()) as unknown as TeamBatchInsertPayload[]
    const resp = await createTeamByBatch(body)

    return NextResponse.json(resp, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 })
  }
}
