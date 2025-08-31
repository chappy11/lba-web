"use client"

import { createMatchSchedule } from "@/_lib/server/matchSchedule"
import LoadingScreen from "@/components/loading-screen"
import { useState } from "react"
import { toast } from "sonner"

export default function GenerateMatchSchedule() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function handleGenerateSchedule() {
    try {
      setIsLoading(true)
      const resp = await createMatchSchedule()

      if (resp) {
        toast.success("Match schedule generated successfully")
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {isLoading && <LoadingScreen />}
      <h1 className="text-2xl font-bold mb-4">Generate Match Schedule</h1>
      <p className="text-gray-600 mb-6">This feature is under development.</p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => handleGenerateSchedule()}
      >
        {isLoading ? "Loading...." : "Generate Schedule"}
      </button>
    </div>
  )
}
