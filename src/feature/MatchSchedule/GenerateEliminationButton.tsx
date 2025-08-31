"use client"
import { createEliminationMatchSchedule } from "@/_lib/server/matchSchedule"
import LoadingScreen from "@/components/loading-screen"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Swal from "sweetalert2"

export default function GenerateEliminationButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  async function handleCraeteEliminationRound() {
    // Logic to create elimination round goes here
    try {
      setIsLoading(true)
      const resp = await createEliminationMatchSchedule()
      console.log("Elimination Round Created", resp)
      Swal.fire({
        title: "Success",
        text: "Elimination round generated successfully",
        icon: "success",
      }).then(() => {
        window.location.reload()
      })
    } catch (error) {
      console.log("Error", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Button
        onClick={() => handleCraeteEliminationRound()}
        disabled={isLoading}
      >
        {isLoading ? "Loading.." : "Generate Elimation Round"}
      </Button>
    </>
  )
}
