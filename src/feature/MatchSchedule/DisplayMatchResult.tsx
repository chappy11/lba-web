"use client"

import { MatchResult } from "@/_lib/dto/MatchSchedule"
import { getMatchResuts } from "@/_lib/server/matchSchedule"
import { Calendar, Trophy } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"

export default function DisplayMatchResult() {
  const [data, setData] = useState<MatchResult[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const sendRequest = useCallback(async () => {
    try {
      const resp = await getMatchResuts()

      setData(resp)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    sendRequest()
  }, [sendRequest])

  const displayLoading = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">
              Loading match results...
            </p>
          </div>
        </div>
      )
    }

    return null
  }, [isLoading])

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Match Results</h2>
            <p className="text-sm text-gray-600">
              {data.length > 0
                ? `${data.length} completed matches`
                : "No matches yet"}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content - Fixed height to show ~5 matches */}
      <div className="h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 scroll-smooth">
        {displayLoading}

        {!isLoading && data.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              No match results available
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Results will appear here after matches are completed
            </p>
          </div>
        )}

        <div className="space-y-4">
          {data.map((val: MatchResult) => {
            const isTeam1Winner = val.winner === val.team1Id
            const isTeam2Winner = val.winner === val.team2Id

            return (
              <div
                className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                key={val.id}
              >
                {/* Match Date/Info */}
                {val.gameDate && (
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600 font-medium">
                      {val.gameDate}
                    </p>
                  </div>
                )}

                {/* Team 1 */}
                <div className="flex flex-row justify-between items-center mb-3">
                  <div className="flex flex-row items-center gap-4 flex-1">
                    <div className="relative">
                      <div
                        className={`rounded-full p-1 ${
                          isTeam1Winner
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg"
                            : "bg-gray-100"
                        }`}
                      >
                        <Image
                          src={val.team1Logo}
                          alt="team 1"
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      </div>
                      {isTeam1Winner && (
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                          <Trophy className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`${
                          isTeam1Winner
                            ? "text-lg font-bold text-gray-900"
                            : "text-base font-medium text-gray-700"
                        }`}
                      >
                        {val.team1}
                      </h3>
                      {isTeam1Winner && (
                        <p className="text-xs text-green-600 font-semibold flex items-center gap-1 mt-0.5">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                          Winner
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`text-right min-w-[60px] ${
                      isTeam1Winner
                        ? "bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500"
                        : "bg-gray-50 border border-gray-200"
                    } rounded-lg px-4 py-2`}
                  >
                    <p
                      className={`text-2xl font-bold ${
                        isTeam1Winner ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      {val.team1Score}
                    </p>
                  </div>
                </div>

                {/* VS Divider */}
                <div className="flex items-center justify-center my-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  <span className="px-4 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-full shadow-md">
                    VS
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>

                {/* Team 2 */}
                <div className="flex flex-row justify-between items-center mt-3">
                  <div className="flex flex-row items-center gap-4 flex-1">
                    <div className="relative">
                      <div
                        className={`rounded-full p-1 ${
                          isTeam2Winner
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg"
                            : "bg-gray-100"
                        }`}
                      >
                        <Image
                          src={val.team2Logo}
                          alt="team 2"
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      </div>
                      {isTeam2Winner && (
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                          <Trophy className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`${
                          isTeam2Winner
                            ? "text-lg font-bold text-gray-900"
                            : "text-base font-medium text-gray-700"
                        }`}
                      >
                        {val.team2}
                      </h3>
                      {isTeam2Winner && (
                        <p className="text-xs text-green-600 font-semibold flex items-center gap-1 mt-0.5">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                          Winner
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`text-right min-w-[60px] ${
                      isTeam2Winner
                        ? "bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500"
                        : "bg-gray-50 border border-gray-200"
                    } rounded-lg px-4 py-2`}
                  >
                    <p
                      className={`text-2xl font-bold ${
                        isTeam2Winner ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      {val.team2Score}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
