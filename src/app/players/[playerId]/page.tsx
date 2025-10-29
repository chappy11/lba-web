import { PlayerMvp } from "@/_lib/dto/PlayerMvp.model"
import { PlayerScoreModel } from "@/_lib/dto/TeamScoring.model"
import { getPlayerById } from "@/_lib/server/player"
import { getPlayerScoresByPlayerId } from "@/_lib/server/playerStatus"
import { getPlayerMvpByPlayerId } from "@/_lib/server/playermvp"
import NavigationHeader from "@/components/navigation-header"
import { THEME } from "@/lib/theme"
import {
  Activity,
  ArrowLeft,
  Award,
  BarChart3,
  Calendar,
  Hash,
  Ruler,
  Star,
  Target,
  TrendingUp,
  Trophy,
  User,
  Users,
  Weight,
  Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{
    playerId: string
  }>
}

export default async function PlayerDetailsPage({ params }: Props) {
  const { playerId } = await params
  const playerData = await getPlayerById(playerId)

  if (!playerData || playerData.length === 0) {
    notFound()
  }

  const player = playerData
  const team = player?.team

  // Fetch player scores and MVP awards
  const [playerScores, playerMvps] = await Promise.all([
    getPlayerScoresByPlayerId(playerId),
    getPlayerMvpByPlayerId(playerId),
  ])

  // Calculate career statistics
  const careerStats = playerScores?.reduce(
    (
      acc: {
        points: number
        rebounds: number
        assists: number
        threePointers: number
        steals: number
        fouls: number
        turnovers: number
        gamesPlayed: number
      },
      game: PlayerScoreModel
    ) => ({
      points: (acc.points || 0) + (game.points || 0),
      rebounds: (acc.rebounds || 0) + (game.rebound || 0),
      assists: (acc.assists || 0) + (game.assist || 0),
      threePointers: (acc.threePointers || 0) + (game.threepoints || 0),
      steals: (acc.steals || 0) + (game.steal || 0),
      fouls: (acc.fouls || 0) + (game.foul || 0),
      turnovers: (acc.turnovers || 0) + (game.turnOver || 0),
      gamesPlayed: acc.gamesPlayed + 1,
    }),
    {
      points: 0,
      rebounds: 0,
      assists: 0,
      threePointers: 0,
      steals: 0,
      fouls: 0,
      turnovers: 0,
      gamesPlayed: 0,
    }
  ) || {
    points: 0,
    rebounds: 0,
    assists: 0,
    threePointers: 0,
    steals: 0,
    fouls: 0,
    turnovers: 0,
    gamesPlayed: 0,
  }

  const avgStats = {
    points:
      careerStats.gamesPlayed > 0
        ? (careerStats.points / careerStats.gamesPlayed).toFixed(1)
        : 0,
    rebounds:
      careerStats.gamesPlayed > 0
        ? (careerStats.rebounds / careerStats.gamesPlayed).toFixed(1)
        : 0,
    assists:
      careerStats.gamesPlayed > 0
        ? (careerStats.assists / careerStats.gamesPlayed).toFixed(1)
        : 0,
    threePointers:
      careerStats.gamesPlayed > 0
        ? (careerStats.threePointers / careerStats.gamesPlayed).toFixed(1)
        : 0,
  }

  return (
    <div className="w-full flex-1 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavigationHeader />
      <div className="w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] max-w-7xl mx-auto py-8">
        {/* Back Button */}
        <Link
          href="/players"
          className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-orange-600 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Players</span>
        </Link>

        {/* Player Header Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div
            className={`${THEME.PLAYER.GRADIENT} px-8 py-12 relative overflow-hidden`}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
              {/* Player Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl" />
                <div className="relative w-64 h-80 bg-white/10 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/50 backdrop-blur-sm">
                  {player?.playerImage && player?.playerImage.trim() !== "" ? (
                    <Image
                      src={player?.playerImage}
                      alt={`${player?.firstname} ${player?.lastname}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-300 to-red-400">
                      <User className="w-32 h-32 text-white/50" />
                    </div>
                  )}
                  {/* Jersey Number Badge */}
                  <div className="absolute top-4 right-4 bg-white text-orange-600 font-black text-3xl w-16 h-16 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/50">
                    #{player?.jerseyNumber}
                  </div>
                </div>
              </div>

              {/* Player Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 mb-4">
                  <span className="text-white font-bold text-sm uppercase tracking-wide">
                    {player?.position}
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-black text-white mb-2 drop-shadow-lg">
                  {player?.firstname}
                </h1>
                <h1 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">
                  {player?.lastname}
                </h1>

                {/* Team Info */}
                {team && (
                  <Link
                    href={`/teams/${team.id}`}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/30 transition-all group mb-6"
                  >
                    {team.teamLogo && (
                      <Image
                        src={team.teamLogo}
                        alt={team.teamName}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-white/50"
                      />
                    )}
                    <div className="text-left">
                      <p className="text-white/70 text-xs font-medium">
                        Plays for
                      </p>
                      <p className="text-white font-bold text-lg group-hover:scale-105 transition-transform">
                        {team.teamName}
                      </p>
                    </div>
                  </Link>
                )}

                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                    <Calendar className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">
                      {player?.age} years old
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                    <Ruler className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">
                      {player?.height}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                    <Weight className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">
                      {player?.weight}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Player Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Personal Info</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">First Name</span>
                <span className="font-bold text-gray-900">
                  {player?.firstname}
                </span>
              </div>
              {player?.middlename && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Middle Name</span>
                  <span className="font-bold text-gray-900">
                    {player?.middlename}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Last Name</span>
                <span className="font-bold text-gray-900">
                  {player?.lastname}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Age</span>
                <span className="font-bold text-gray-900">
                  {player?.age} years
                </span>
              </div>
              {player?.playerType && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Type</span>
                  <span className="font-bold text-gray-900">
                    {player?.playerType}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Physical Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Physical Stats</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Height
                </span>
                <span className="font-bold text-gray-900 text-lg">
                  {player?.height}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Weight
                </span>
                <span className="font-bold text-gray-900 text-lg">
                  {player?.weight}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Jersey Number
                </span>
                <span className="font-bold text-gray-900 text-2xl">
                  #{player?.jerseyNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Position & Team */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className={`${THEME.PLAYER.GRADIENT} px-6 py-4`}>
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">
                  Position & Team
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Position</span>
                <span className="font-bold text-orange-600 text-lg">
                  {player?.position}
                </span>
              </div>
              {team && (
                <>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Team</span>
                    <span className="font-bold text-gray-900">
                      {team.teamName}
                    </span>
                  </div>
                  <div className="pt-2">
                    <Link
                      href={`/teams/${team.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <Users className="w-5 h-5" />
                      View Team
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Player Status Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Player Status</h2>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Status */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <div className="bg-green-500 p-3 rounded-full">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Status</p>
                  <p className="text-2xl font-black text-green-700">Active</p>
                </div>
              </div>

              {/* Player Type */}
              {player?.playerType && (
                <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <div className="bg-blue-500 p-3 rounded-full">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Player Type
                    </p>
                    <p className="text-2xl font-black text-blue-700 capitalize">
                      {player?.playerType}
                    </p>
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                <div className="bg-purple-500 p-3 rounded-full">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Joined League
                  </p>
                  <p className="text-lg font-bold text-purple-700">
                    {new Date(player?.dateCreated).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Jersey Number Highlight */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-full">
                  <Hash className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Jersey Number
                  </p>
                  <p className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    #{player?.jerseyNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Career Statistics Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div className={`${THEME.PLAYER.GRADIENT} px-6 py-4`}>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Career Statistics
              </h2>
            </div>
            <p className="text-white/80 text-sm mt-1">
              {careerStats.gamesPlayed} games played
            </p>
          </div>
          <div className="p-6">
            {careerStats.gamesPlayed > 0 ? (
              <>
                {/* Average Stats */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Averages Per Game
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        <p className="text-sm font-medium text-gray-600">
                          Points
                        </p>
                      </div>
                      <p className="text-3xl font-black text-blue-700">
                        {avgStats.points}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PPG</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-green-600" />
                        <p className="text-sm font-medium text-gray-600">
                          Rebounds
                        </p>
                      </div>
                      <p className="text-3xl font-black text-green-700">
                        {avgStats.rebounds}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">RPG</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <p className="text-sm font-medium text-gray-600">
                          Assists
                        </p>
                      </div>
                      <p className="text-3xl font-black text-purple-700">
                        {avgStats.assists}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">APG</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-orange-600" />
                        <p className="text-sm font-medium text-gray-600">
                          3-Pointers
                        </p>
                      </div>
                      <p className="text-3xl font-black text-orange-700">
                        {avgStats.threePointers}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">3PG</p>
                    </div>
                  </div>
                </div>

                {/* Total Stats */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Career Totals
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 font-medium mb-1">
                        Points
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {careerStats.points}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 font-medium mb-1">
                        Rebounds
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {careerStats.rebounds}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 font-medium mb-1">
                        Assists
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {careerStats.assists}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 font-medium mb-1">
                        3-Pointers
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {careerStats.threePointers}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 font-medium mb-1">
                        Steals
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {careerStats.steals}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 font-medium mb-1">
                        Fouls
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {careerStats.fouls}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 font-medium mb-1">
                        Turnovers
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {careerStats.turnovers}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Statistics Yet
                </h3>
                <p className="text-gray-600">
                  This player hasn&apos;t played any games yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* MVP Awards Section */}
        {playerMvps && playerMvps.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 px-6 py-4">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">MVP Awards</h2>
              </div>
              <p className="text-white/80 text-sm mt-1">
                {playerMvps.length} time{playerMvps.length !== 1 ? "s" : ""} MVP
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {playerMvps.map((mvp: PlayerMvp, index: number) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border-2 border-yellow-200 hover:border-yellow-400 transition-all hover:scale-105"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-3 rounded-full">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Game MVP
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(mvp.dateCreated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 font-medium mb-1">
                        Game ID
                      </p>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {mvp.gameId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
