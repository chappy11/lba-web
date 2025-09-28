import { CreatePlayerPlayload } from "@/_lib/dto/PlayerMvp.model";
import { getPlayerMvpByGameId, insertPlayerMvp } from "@/_lib/services/PlayerMvp.service";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown as CreatePlayerPlayload

    const resp = await insertPlayerMvp(body);

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
        const playerData = await getPlayerMvpByGameId(gameId);
        return NextResponse.json(playerData, { status: 200 })
    } catch (error) {
        return NextResponse.json(error, { status: 500 })
    }
}
