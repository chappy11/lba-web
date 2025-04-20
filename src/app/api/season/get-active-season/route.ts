import { getActiveSeason } from "@/_lib/services/SeasonService.service"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const resp = await getActiveSeason()

        return NextResponse.json(resp,{status:200})
    } catch (error) {
        return NextResponse.json([],{status:500})
    }
}