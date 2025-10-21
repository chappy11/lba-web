import { Match } from "@/_lib/dto/MatchSchedule";
import { updateEliminationRoundWithAdvancement } from "@/_lib/services/MatchSchedule.service";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { matchData, shouldAdvance } = body;

    console.log('🔄 API: Received elimination update request:', {
      matchId: matchData?.id,
      shouldAdvance,
      winner: matchData?.winner
    });

    if (!matchData) {
      return NextResponse.json(
        {
          success: false,
          message: "Match data is required",
        },
        { status: 400 }
      );
    }

    // Update the match and optionally advance winner
    const result = await updateEliminationRoundWithAdvancement(matchData as Match, shouldAdvance);

    console.log('✅ API: Update successful:', result);

    return NextResponse.json(
      {
        success: true,
        message: shouldAdvance 
          ? "Match updated and winner advanced to next round" 
          : "Match updated successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ API: Update failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update match",
        error: String(error),
      },
      { status: 500 }
    );
  }
}