import { PlayerStatusPayloadBulkInsert } from "@/_lib/dto/TeamScoring.model";
import { bulkInsertPlayerStatus } from "@/_lib/services/PlayerScore.service";

import { NextResponse } from "next/server";

export async function POST(request: Request) { 
    try {
    const body = (await request.json()) as unknown as PlayerStatusPayloadBulkInsert[]
       
    console.log("Received payload for bulk insert:", body);
    
    const resp = await bulkInsertPlayerStatus(body);
    return NextResponse.json(
        { message: "Successfully Added", data: resp },
        { status: 200 }
    );  
    } catch (error) {
        console.error("Error during bulk insert:", error);
        return NextResponse.json(
            { message: "Failed to add player statuses", error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}