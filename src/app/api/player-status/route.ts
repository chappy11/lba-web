

import { PlayerStatusPayload } from "@/_lib/dto/TeamScoring.model";
import { createPlayerStatus, getPlayerStatusByGameId } from "@/_lib/services/PlayerScore.service";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown as PlayerStatusPayload
    const resp = await createPlayerStatus(body);

    return NextResponse.json(
      { message: "Successfully Added", data: resp },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
           const { searchParams } = new URL(request.url);
        const gameId = searchParams.get("gameId");
        if (!gameId) {
            return NextResponse.json({ message: "gameId is required" }, { status: 400 });
        }
        const playerData = await getPlayerStatusByGameId(gameId)
        return NextResponse.json(playerData, { status: 200 })
    } catch (error) {
        return NextResponse.json(error, { status: 500 })
    }
}
