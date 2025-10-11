import { Season } from "@/_lib/dto/Season.model"
import { getSeasons } from "@/_lib/server/season"
import AdminDashboard from "@/feature/admin/AdminDashboard"
import { BG, THEME } from "@/lib/theme"
import { AlertCircle, Calendar, Sparkles, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function Page() {
  const seasons = (await getSeasons()) as Season[]

  if (seasons.length < 1) {
    return (
      <div
        className={`min-h-screen flex flex-col justify-center items-center ${BG.LIGHT} p-6`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-12 max-w-md text-center">
          <div
            className={`${THEME.PLAYER.GRADIENT} p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center`}
          >
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            No Season Found
          </h2>
          <p className="text-gray-600 mb-6">
            Please create a season first to get started with managing your
            basketball league.
          </p>
          <Link
            href="/administrator/season"
            className={`inline-flex items-center gap-2 ${THEME.INFO.GRADIENT} text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
          >
            <Sparkles className="w-5 h-5" />
            Create New Season
          </Link>
        </div>
      </div>
    )
  }

  const findActiveSeason = seasons.find((season) => season.isActiveSeason == 1)

  if (!findActiveSeason) {
    return (
      <div
        className={`min-h-screen flex flex-col justify-center items-center ${BG.LIGHT} p-6`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-12 max-w-md text-center">
          <div
            className={`${THEME.WARNING.GRADIENT} p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center`}
          >
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            No Active Season
          </h2>
          <p className="text-gray-600 mb-6">
            Please set an active season to manage your basketball league.
          </p>
          <Link
            href="/administrator/season"
            className={`inline-flex items-center gap-2 ${THEME.INFO.GRADIENT} text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
          >
            <Calendar className="w-5 h-5" />
            Set Active Season
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${BG.GRADIENT} pb-12`}>
      {/* Hero Section with Season Info */}
      <div
        className={`${THEME.INFO.GRADIENT} text-white py-12 px-6 shadow-2xl`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Season Logo and Info */}
            <div className="flex flex-col md:flex-row items-center gap-6 flex-1">
              <div className="relative group">
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white p-2 rounded-full shadow-2xl ring-4 ring-white/30">
                  <Image
                    src={findActiveSeason.seasonLogo}
                    width={120}
                    height={120}
                    alt="Season logo"
                    className="rounded-full"
                  />
                </div>
              </div>

              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                    Active Season
                  </span>
                  <span className="bg-green-500 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Live
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {findActiveSeason.seasonName}
                </h1>
                <p className="text-xl text-white/90 italic">
                  &ldquo;{findActiveSeason.seasonMotto}&rdquo;
                </p>
                <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                    <p className="text-xs text-white/70">Start Date</p>
                    <p className="font-semibold">
                      {new Date(
                        findActiveSeason.seasonStartDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                    <p className="text-xs text-white/70">End Date</p>
                    <p className="font-semibold">
                      {new Date(
                        findActiveSeason.seasonEndDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/administrator/season"
                className="group bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Manage Seasons
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 text-center">
                <div className="flex items-center gap-2 justify-center">
                  <TrendingUp className="w-4 h-4" />
                  <p className="text-sm font-semibold">Dashboard Overview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`${THEME.TEAMS.GRADIENT_BR} p-3 rounded-xl`}>
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Teams</p>
                <p className="text-3xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`${THEME.PLAYER.GRADIENT_BR} p-3 rounded-xl`}>
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active Players</p>
                <p className="text-3xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`${THEME.SUCCESS.GRADIENT_BR} p-3 rounded-xl`}>
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Games</p>
                <p className="text-3xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Management Center
          </h2>
          <p className="text-gray-600">
            Quick access to all administrative features
          </p>
          <div
            className={`h-1 w-24 ${THEME.INFO.GRADIENT} rounded-full mt-3`}
          />
        </div>

        <AdminDashboard />
      </div>
    </div>
  )
}
