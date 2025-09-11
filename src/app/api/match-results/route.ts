import { getMatchResults } from "@/_lib/services/MatchSchedule.service";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const matchResults = await getMatchResults();

    return NextResponse.json(matchResults, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
