
import { getNearestMatches } from "@/_lib/services/MatchSchedule.service";

import { NextResponse } from "next/server";

export async function GET() {
    try {
        const resp = await getNearestMatches();
        return NextResponse.json(resp, { status: 200 })
    } catch (error) {
        return NextResponse.json(error, { status: 500 })
    }
}
