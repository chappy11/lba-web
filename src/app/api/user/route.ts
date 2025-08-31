import { CreateUserPayload, LoginPayload } from "@/_lib/dto/User.model"
import { createUser, login } from "@/_lib/services/User.service"

import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateUserPayload
    const resp = await createUser(body)

    if (resp) {
      return NextResponse.json(JSON.stringify(resp), { status: 201 })
    }
    return NextResponse.json("Something went wrong", { status: 500 })
  } catch (error) {
    console.log(error)
    return new Response("Invalid JSON", { status: 400 })
  }
}
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const password = searchParams.get("password")
    const payload: LoginPayload = {
      email: email as string,
      password: password as string,
    }

    const resp = await login(payload)

    if (resp) {
      return NextResponse.json(resp, { status: 200 })
    }

    return NextResponse.json("No Data Found", { status: 404 })
  } catch (error) {
      console.log(error)
    return NextResponse.json("Something went wrong", { status: 500 })
  }
}
