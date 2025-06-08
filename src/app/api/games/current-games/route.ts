
import { getGetGamesById } from "@/_lib/services/GameService.service";

import { NextResponse } from "next/server";

export async function GET(request:Request) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get("gameId")

    const gameData = await getGetGamesById(gameId as string);
      if (!gameData) {
        return NextResponse.json({ message: "Game not found" }, { status: 404 });
    }  
    return NextResponse.json(gameData, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

