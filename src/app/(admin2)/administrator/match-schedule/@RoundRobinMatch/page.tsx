import {
  getEliminationMatchSchedule,
  getMatchSchedule,
} from "@/_lib/server/matchSchedule"
import DisplayMatchSchedule from "@/feature/MatchSchedule/DisplayMatchScedule"
import GenerateMatchSchedule from "@/feature/MatchSchedule/GenerateMatchSchedule"
import { CalendarDays, Trophy, Users, Zap } from "lucide-react"

export default async function RoundRobinMatch() {
  const resp = await getMatchSchedule()

  const eliminationMatches = await getEliminationMatchSchedule()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {resp.length < 1 ? (
          <>
            {/* Beautiful Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
                <CalendarDays className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Round Robin Tournament
              </h1>
              <p className="text-gray-600 text-lg">
                Create your tournament schedule and manage matches
              </p>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mt-4" />
            </div>

            {/* No Matches State */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Gradient Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Setup Tournament
                    </h2>
                    <p className="text-blue-100 mt-1">
                      Generate matches for all teams in round-robin format
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8">
                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <CalendarDays className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        Automated Scheduling
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Automatically generate matches for all teams with optimal
                      scheduling
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Fair Play</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Every team plays against every other team exactly once
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-purple-500 p-2 rounded-lg">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        Live Standings
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Real-time ranking updates as matches are completed
                    </p>
                  </div>
                </div>

                {/* Action Area */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Ready to Start?
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Generate your round-robin tournament schedule and begin
                      managing matches between all teams.
                    </p>
                    <GenerateMatchSchedule />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Footer */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Tournament Format
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Round-robin ensures every team faces every other team,
                  providing the most comprehensive competition format.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Trophy className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Fair Ranking</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Rankings are based on wins, losses, and total points scored,
                  ensuring the most deserving team emerges as champion.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Tournament Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Round Robin Tournament
              </h1>
              <p className="text-gray-600">
                Live tournament progress and standings
              </p>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mt-4" />
            </div>

            {/* Tournament Display */}
            <DisplayMatchSchedule
              data={resp[0]}
              eliminationMatches={eliminationMatches}
            />
          </>
        )}
      </div>
    </div>
  )
}
