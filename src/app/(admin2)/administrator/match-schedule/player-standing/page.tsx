"use client"

import PlayerScoring from "@/feature/players/PlayerScoring"
import { useSearchParams } from "next/navigation"

export default function Page() {
  const searchParams = useSearchParams()
  const gameId = searchParams.get("gameId")
  const matchId = searchParams.get("matchId")

  return (
    <PlayerScoring gameId={gameId!} gameRecordId={matchId!} isUpdate={true} />
  )
}