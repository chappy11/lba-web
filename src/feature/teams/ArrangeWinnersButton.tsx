"use client"

import { arrangeEliminationWinners } from "@/_lib/services/MatchSchedule.service"
import { THEME } from "@/lib/theme"
import { CheckCircle, Loader2, Trophy } from "lucide-react"
import { useState } from "react"
import Swal from "sweetalert2"

type SemifinalWinner = {
  teamId: string
  teamName: string
  teamLogo: string
  totalScore: number
  matchIndex: number
}

export default function ArrangeWinnersButton() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleArrangeWinners = async () => {
    try {
      setLoading(true)
      setSuccess(false)

      const result = await arrangeEliminationWinners()
        console.log(    "Result", result)
      if (result.success) {
        setSuccess(true)
        
        await Swal.fire({
          icon: "success",
          title: "Winners Arranged!",
          html: `
            <div class="text-left">
              <p class="mb-2"><strong>${result.semifinalWinners?.length || 0}</strong> semifinal winners have been advanced to the final match.</p>
              ${
                result.semifinalWinners && result.semifinalWinners.length > 0
                  ? `
                <div class="mt-4">
                  <p class="font-semibold mb-2">Advancing to Finals:</p>
                  <ul class="list-disc pl-5">
                    ${result.semifinalWinners
                      .map(
                        (winner: SemifinalWinner) =>
                          `<li>${winner.teamName} (${winner.totalScore} points)</li>`
                      )
                      .join("")}
                  </ul>
                </div>
              `
                  : ""
              }
            </div>
          `,
          confirmButtonText: "Great!",
          confirmButtonColor: "#3b82f6",
        })

        // Refresh the page to show updated data
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        throw new Error(result.message || "Failed to arrange winners")
      }
    } catch (error) {
      console.error("Error arranging winners:", error)
      
      await Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to arrange elimination winners. Please try again.",
        confirmButtonColor: "#ef4444",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleArrangeWinners}
      disabled={loading || success}
      className={`
        ${THEME.ACHIEVEMENT.GRADIENT}
        text-white font-semibold px-6 py-3 rounded-xl
        shadow-lg hover:shadow-xl
        transition-all duration-300
        flex items-center gap-3
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-105 active:scale-95
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Arranging Winners...</span>
        </>
      ) : success ? (
        <>
          <CheckCircle className="w-5 h-5" />
          <span>Winners Arranged!</span>
        </>
      ) : (
        <>
          <Trophy className="w-5 h-5" />
          <span>Arrange Elimination Winners</span>
        </>
      )}
    </button>
  )
}
