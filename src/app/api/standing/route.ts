import { getStandingThisSeason } from "@/_lib/services/TeamService.service";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const teams =
			await getStandingThisSeason();

		return NextResponse.json(teams, {
			status: 200,
		});
	} catch (error) {
		return NextResponse.json(error, {
			status: 500,
		});
	}
}
