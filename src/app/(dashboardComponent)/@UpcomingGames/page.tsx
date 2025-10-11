import { Match } from "@/_lib/dto/MatchSchedule"
import { getNearestMatches } from "@/_lib/server/matchSchedule"
import { getTeamById } from "@/_lib/server/team"
import { THEME } from "@/lib/theme"
import { Calendar, Clock, MapPin, Trophy } from "lucide-react"
import Image from "next/image"

export default async function UpcomingGames() {
  const resp = (await getNearestMatches()) as Match

  if (!resp) {
    return (
      <div className="text-white text-center py-12">
        <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-xl font-semibold">No upcoming games available.</p>
      </div>
    )
  }

  // Get team data with featured players
  const team1Data = resp.team1Id ? await getTeamById(resp.team1Id) : null
  const team2Data = resp.team2Id ? await getTeamById(resp.team2Id) : null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className={`${THEME.WARNING.GRADIENT} p-3 rounded-xl`}>
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Upcoming Match
          </h1>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-white/90">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">{formatDate(resp.gameDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className="font-medium">{resp.gameTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">{resp.address}</span>
          </div>
        </div>
      </div>

      {/* Main Match Display */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0 divide-x divide-white/20">
          {/* Team 1 */}
          <div className="p-8">
            {/* Team Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                {resp.team1Logo && (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
                    <Image
                      src={resp.team1Logo}
                      alt={resp.team1}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h2 className="text-3xl font-bold text-white">{resp.team1}</h2>
              </div>
            </div>

            {/* Featured Players */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white/80 mb-4">
                Featured Player
              </h3>
              {team1Data?.featurePlayer ? (
                <div className="flex items-center gap-4 bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-300 border border-white/10">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/30">
                    {team1Data.featurePlayer.playerImage ? (
                      <Image
                        src={team1Data.featurePlayer.playerImage}
                        alt={`${team1Data.featurePlayer.firstname} ${team1Data.featurePlayer.lastname}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full ${THEME.PLAYER.GRADIENT} flex items-center justify-center text-white font-bold text-2xl`}
                      >
                        {team1Data.featurePlayer.firstname?.[0]}
                        {team1Data.featurePlayer.lastname?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-lg">
                      {team1Data.featurePlayer.firstname} {team1Data.featurePlayer.lastname}
                    </p>
                    <p className="text-sm text-white/70">
                      #{team1Data.featurePlayer.jerseyNumber} • {team1Data.featurePlayer.position}
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      {team1Data.featurePlayer.height} • {team1Data.featurePlayer.weight}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-white/50 text-center py-4">
                  No featured player available
                </p>
              )}
            </div>
          </div>

          {/* Team 2 */}
          <div className="p-8">
            {/* Team Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h2 className="text-3xl font-bold text-white">{resp.team2}</h2>
                {resp.team2Logo && (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
                    <Image
                      src={resp.team2Logo}
                      alt={resp.team2}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Featured Players */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white/80 mb-4">
                Featured Player
              </h3>
              {team2Data?.featurePlayer ? (
                <div className="flex items-center gap-4 bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-300 border border-white/10">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/30">
                    {team2Data.featurePlayer.playerImage ? (
                      <Image
                        src={team2Data.featurePlayer.playerImage}
                        alt={`${team2Data.featurePlayer.firstname} ${team2Data.featurePlayer.lastname}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full ${THEME.TEAMS.GRADIENT} flex items-center justify-center text-white font-bold text-2xl`}
                      >
                        {team2Data.featurePlayer.firstname?.[0]}
                        {team2Data.featurePlayer.lastname?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-lg">
                      {team2Data.featurePlayer.firstname} {team2Data.featurePlayer.lastname}
                    </p>
                    <p className="text-sm text-white/70">
                      #{team2Data.featurePlayer.jerseyNumber} • {team2Data.featurePlayer.position}
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      {team2Data.featurePlayer.height} • {team2Data.featurePlayer.weight}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-white/50 text-center py-4">
                  No featured player available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* VS Divider */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
          <div
            className={`${THEME.INFO.GRADIENT} rounded-full w-16 h-16 flex items-center justify-center border-4 border-white shadow-2xl`}
          >
            <span className="text-white font-bold text-xl">VS</span>
          </div>
        </div>
      </div>

      {/* Mobile VS Badge */}
      <div className="md:hidden -my-6 relative z-10 flex justify-center">
        <div
          className={`${THEME.INFO.GRADIENT} rounded-full w-14 h-14 flex items-center justify-center border-4 border-white shadow-xl`}
        >
          <span className="text-white font-bold text-lg">VS</span>
        </div>
      </div>
    </div>
  )
}
