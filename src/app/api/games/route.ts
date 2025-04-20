import { GameInserPayload } from "@/_lib/dto/Game.model";
import { PlayerInsertPayload } from "@/_lib/dto/Player.model";
import { TeamInsertPayload } from "@/_lib/dto/Team.model";
import {
  getAllGamesViaLatestSeason,
  insertGame,
} from "@/_lib/services/GameService.service";
import {
  getAllPlayer,
  getPlayerById,
  getPlayerTeamId,
  insertPlayer,
} from "@/_lib/services/PlayerService.service";

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

export async function GET(request: Request) {
  try {
    const allPlayer = await getAllGamesViaLatestSeason();

    return NextResponse.json(allPlayer, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
