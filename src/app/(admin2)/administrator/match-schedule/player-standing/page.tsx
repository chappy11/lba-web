"use client"

import { useSearchParams } from "next/navigation"

export default function Page() {
      const searchParams = useSearchParams()
    const gameId = searchParams.get("gameId")
    const matchId = searchParams.get("matchId")

    console.log(matchId)
    return <div>Player Standing Page</div>
}