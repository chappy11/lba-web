import { SeasonInsertPayload } from "@/_lib/dto/Season.model";
import { getActiveSeason, getAllSeason, insertSeason } from "@/_lib/services/SeasonService.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {

        const body = await request.json() as unknown as SeasonInsertPayload;

      
        const resp = await insertSeason(body)
    
    
        return NextResponse.json({message:"Successfully Added",data:resp},{status:200})
    } catch (error) {
        return NextResponse.json(error,{status:500})
    }

}

export async function GET() {
    try {
        const resp = await getAllSeason()

        return NextResponse.json(resp,{status:200})
    } catch (error) {
        return NextResponse.json([],{status:500})
    }
}