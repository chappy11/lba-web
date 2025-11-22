import { InsertPlayerViaBatchUpload } from "@/_lib/dto/Player.model"
import { insertPlayerViaBatchUpload } from "@/_lib/services/PlayerService.service"

import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as unknown as InsertPlayerViaBatchUpload[]

    if (body.length < 1) {
      return NextResponse.json(
        {
          message: "No data inserted",
        },
        {
          status: 401,
        }
      )
    }

    const resp = await insertPlayerViaBatchUpload(body)

    return NextResponse.json(
      {
        message: "Successfully Createdd",
        data: resp,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        data: error,
      },
      {
        status: 500,
      }
    )
  }
}
