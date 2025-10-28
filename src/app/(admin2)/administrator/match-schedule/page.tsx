import { MatchType } from "@/_lib/dto/Season.model"
import { getCurrentSeason } from "@/_lib/server/season"
import { CalendarDays, Trophy } from "lucide-react"
import EleminationRoundMatch from "./@EleminationRoundMatch/page"
import RoundRobinMatch from "./@RoundRobinMatch/page"

export default async function Page() {
  const season = await getCurrentSeason()
  const matchType = season?.matchType

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <div className="max-w-[1920px] mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl shadow-lg">
                <CalendarDays className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Match Schedule
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and view all tournament schedules
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="hidden md:block">
              <a
                href="/administrator/match-schedule/team-assignment"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                Assign Teams
              </a>
            </div>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-red-600 rounded-full" />
        </div>

        {/* Elimination Round Section */}
        {(!matchType || matchType === MatchType.ELIMINATION) && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">
                    Elimination Round
                  </h2>
                </div>
                <p className="text-white/90 text-sm mt-1">
                  Playoff matches and finals
                </p>
              </div>
              <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
                <EleminationRoundMatch />
              </div>
            </div>
          </div>
        )}

        {/* Round Robin Section */}
        {(!matchType || matchType === MatchType.ROUND_ROBIN) && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-6 h-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">
                    Round Robin Matches
                  </h2>
                </div>
                <p className="text-white/90 text-sm mt-1">
                  Regular season tournament schedule
                </p>
              </div>
              <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
                <RoundRobinMatch />
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <CalendarDays className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Scheduled</h3>
            </div>
            <p className="text-sm text-gray-600">
              All matches are organized by rounds and dates
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Live Updates</h3>
            </div>
            <p className="text-sm text-gray-600">
              Scores and results updated in real-time
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Organized</h3>
            </div>
            <p className="text-sm text-gray-600">
              Easy to manage and track all tournament progress
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
