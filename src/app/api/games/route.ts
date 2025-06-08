import { GameInserPayload } from "@/_lib/dto/Game.model";
import {
  getAllGamesViaLatestSeason,
  insertGame,
} from "@/_lib/services/GameService.service";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown as GameInserPayload;

    const resp = await insertGame(body);

    return NextResponse.json(
      { message: "Successfully Added", data: resp },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function GET() {
  try {
    const allPlayer = await getAllGamesViaLatestSeason();

    return NextResponse.json(allPlayer, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
