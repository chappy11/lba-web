"use client"

import Header from "@/components/header"
import UpdateGames from "@/feature/game/UpdateGames"
import { useSearchParams } from "next/navigation"

export default function Page() {
  const searchParams = useSearchParams()
  const gameId = searchParams.get("id")

  if (!gameId) {
    return (
      <div className=" h-screen w-screen flex flex-1 justify-center items-center">
        <p>Game Not Found</p>
      </div>
    )
  }
  return (
    <div className=" flex-1 flex-col ">
      <div className=" w-[60%] mx-auto">
        <div className=" h-3" />
              <Header title="Update Game" />
              <UpdateGames gameId={gameId} />
      </div>
    </div>
  )
}
