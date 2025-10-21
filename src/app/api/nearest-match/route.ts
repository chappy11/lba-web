
import { getNearestMatches } from "@/_lib/services/MatchSchedule.service";

import { NextResponse } from "next/server";

export async function GET() {
    try {
      const resp = await getNearestMatches()

      // If no matches found, return null with 200 status
      if (!resp) {
        return NextResponse.json(null, { status: 200 })
      }

      return NextResponse.json(resp, { status: 200 })
    } catch (error) {
        console.error("Error fetching nearest match:", error)
        // Return null instead of error for graceful handling
        return NextResponse.json(null, { status: 200 })
    }
}
