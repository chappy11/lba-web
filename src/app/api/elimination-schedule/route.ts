import { Match } from "@/_lib/dto/MatchSchedule";
import { updateEliminationRound } from "@/_lib/services/MatchSchedule.service";

import { NextResponse } from "next/server";

export async function PUT(
    request: Request
) {
    try {
        const body =
            (await request.json()) as unknown as Match;

        const resp = await updateEliminationRound(body);

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
