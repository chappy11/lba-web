import {
	getAllUpcomingGames,
	migrateAllDataToISO,
} from "@/_lib/services/GameService.service";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const gameData =
			await getAllUpcomingGames();
		return NextResponse.json(gameData, {
			status: 200,
		});
	} catch (error) {
		return NextResponse.json(error, {
			status: 500,
		});
	}
}

export async function POST() {
	await migrateAllDataToISO();
	return NextResponse.json("tes3t", {
		status: 200,
	});
}
