// app/actions.ts
"use server"

import { cookies } from "next/headers";

export async function setSession(value: string) {
    const cookieStore = cookies(); // ⬅️ no await here
  (await cookieStore).set("user", value, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60, // 1 hour
  })
}

export async function getSession() {
    const cookieStore = cookies();
  return (await cookieStore).get("user")?.value
}