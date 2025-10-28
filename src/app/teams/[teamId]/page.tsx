import { Player } from "@/_lib/dto/Player.model"
import { getPlayerByTeams } from "@/_lib/server/player"
import { getTeamById } from "@/_lib/server/team"
import NavigationHeader from "@/components/navigation-header"
import PlayerCard from "@/components/player-card"
import {
    ArrowLeft,
    Award,
    Trophy,
    User,
    Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{
    teamId: string
  }>
}

export default async function TeamDetailsPage({ params }: Props) {
  const { teamId } = await params
  const team = await getTeamById(teamId)
  const players = await getPlayerByTeams(teamId)

  if (!team) {
    notFound()
  }

  return (
    <div className="w-full flex-1 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavigationHeader />
      <div className="w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] max-w-7xl mx-auto py-8">
        {/* Back Button */}
        <Link
          href="/teams"
          className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-purple-600 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Teams</span>
        </Link>

        {/* Team Header Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 px-8 py-12 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              {/* Team Logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-xl" />
                <div className="relative p-3 bg-white rounded-full shadow-2xl ring-4 ring-white/50">
                  <Image
                    src={team.teamLogo}
                    alt={team.teamName}
                    width={180}
                    height={180}
                    className="rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Team Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-5xl font-black text-white mb-3 drop-shadow-lg">
                  {team.teamName}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                    <User className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">
                      Coach: {team.coachInfo?.firstname}{" "}
                      {team.coachInfo?.lastname}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                    <Users className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">
                      {players?.length || 0} Players
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                    <Trophy className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">
                      {team.teamType} Team
                    </span>
                  </div>
                </div>
                {team.featurePlayer && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/20 backdrop-blur-sm rounded-lg border border-yellow-400/40">
                    <Award className="w-5 h-5 text-yellow-300" />
                    <span className="text-white font-semibold">
                      Featured: {team.featurePlayer.firstname}{" "}
                      {team.featurePlayer.lastname}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Players Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`h-12 w-2 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full`}
            />
            <div>
              <h2 className="text-3xl font-black text-gray-900">
                Team Roster
              </h2>
              <p className="text-gray-600 mt-1">
                {players?.length || 0} player
                {players?.length !== 1 ? "s" : ""} in the squad
              </p>
            </div>
          </div>

          {players && players.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {players.map((player: Player) => (
                <PlayerCard 
                  key={player.id}
                  player={player}
                  team={team}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Players Yet
              </h3>
              <p className="text-gray-600">
                This team doesn&apos;t have any players assigned yet.
              </p>
            </div>
          )}
        </div>

        {/* Coach Information Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Coaching Staff
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-4 rounded-full">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {team.coachInfo?.firstname} {team.coachInfo?.middlename}{" "}
                  {team.coachInfo?.lastname}
                </h3>
                <p className="text-gray-600 font-medium">Head Coach</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
