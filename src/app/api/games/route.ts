import {
	GameInserPayload,
	UpdateGamePayload,
} from "@/_lib/dto/Game.model";
import {
	getAllGamesViaLatestSeason,
	insertGame,
	updateGameById,
} from "@/_lib/services/GameService.service";

import { NextResponse } from "next/server";

export async function POST(
	request: Request
) {
	try {
		const body =
			(await request.json()) as unknown as GameInserPayload;

		const resp = await insertGame(body);

		return NextResponse.json(
			{
				message: "Successfully Added",
				data: resp,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(error, {
			status: 500,
		});
	}
}

export async function GET() {
	try {
		const allPlayer =
			await getAllGamesViaLatestSeason();

		return NextResponse.json(
			allPlayer,
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(error, {
			status: 500,
		});
	}
}

export async function PUT(
	request: Request
) {
	try {
		const { searchParams } = new URL(
			request.url
		);
		const gameId =
			searchParams.get("gameId");
		const body =
			(await request.json()) as unknown as UpdateGamePayload;

		const gameData =
			await updateGameById(
				gameId as string,
				body
			);
		if (!gameData) {
			return NextResponse.json(
				{ message: "Game not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(gameData, {
			status: 200,
		});
	} catch (error) {
		return NextResponse.json(error, {
			status: 500,
		});
	}
}
