import { PlayerInsertPayload } from "@/_lib/dto/Player.model";
import {
  getAllPlayer,
  getPlayerById,
  getPlayerTeamId,
  insertPlayer,
  updatePlayer,
} from "@/_lib/services/PlayerService.service"

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown as PlayerInsertPayload;

    const resp = await insertPlayer(body);

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
    const playerId = searchParams.get("playerId");
    const teamId = searchParams.get("teamId");
    if (playerId) {
      const playerData = await getPlayerById(playerId);

      return NextResponse.json(playerData, { status: 200 });
    }
    if (teamId) {
      const playersOfTeam = await getPlayerTeamId(teamId);

      return NextResponse.json(playersOfTeam, { status: 200 });
    }

    const allPlayer = await getAllPlayer();

    return NextResponse.json(allPlayer, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const playerId = searchParams.get("playerId")

    if (!playerId) {
      return NextResponse.json(
        { error: "playerId is required" },
        { status: 400 }
      )
    }

    const body = await request.json()

    await updatePlayer(playerId, body)

    return NextResponse.json(
      { message: "Player updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating player:", error)
    return NextResponse.json(
      { error: "An error occurred while updating the player." },
      { status: 500 }
    )
  }
}
