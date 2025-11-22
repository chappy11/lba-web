import { Player, PlayerWithTeam } from "@/_lib/dto/Player.model"
import { Team } from "@/_lib/dto/Team.model"
import UpdatePlayer from "@/feature/players/UpdatePlayer"
import UpdateFeaturePlayer from "@/feature/teams/UpdateFeaturePlayer"
import { THEME } from "@/lib/theme"
import { User, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Props = {
  player: Player | PlayerWithTeam
  team: Team | undefined
  isShowUpdate?: boolean
}

export default function PlayerCard(props: Props) {
  const { player, team, isShowUpdate = false } = props
  const playerWithTeam = player as PlayerWithTeam

  const cardContent = (
    <>
      {/* Background Gradient Overlay */}
      <div
        className={`absolute inset-0 ${THEME.PLAYER.GRADIENT} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      {/* Jersey Number Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className={`${THEME.PLAYER.GRADIENT} text-white font-bold text-lg w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white`}
        >
          #{player.jerseyNumber}
        </div>
      </div>

      {/* Position Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm text-gray-800 font-semibold text-xs px-3 py-1.5 rounded-full shadow-md border border-gray-200">
          {player.position}
        </div>
      </div>

      {/* Player Image */}
      <div className="relative h-80 bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden">
        {player.playerImage && player.playerImage.trim() !== "" ? (
          <>
            <Image
              src={player.playerImage}
              fill
              alt={`${player.firstname} ${player.lastname}`}
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Gradient Overlay at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        ) : (
          <div
            className={`w-full h-full ${THEME.PLAYER.GRADIENT} flex items-center justify-center`}
          >
            <User className="w-32 h-32 text-white/50" />
          </div>
        )}
      </div>

      {/* Player Info */}
      <div className="p-5 relative">
        {/* Name */}
        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">
          {player.firstname} {player.lastname}
        </h3>

        {/* Team Info */}
        {playerWithTeam.team && (
          <div className="flex items-center gap-2 mb-3 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium line-clamp-1">
              {playerWithTeam.team.teamName}
            </span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
            <p className="text-xs text-gray-500">Height</p>
            <p className="font-bold text-sm text-gray-900">{player.height}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
            <p className="text-xs text-gray-500">Weight</p>
            <p className="font-bold text-sm text-gray-900">{player.weight}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
            <p className="text-xs text-gray-500">Age</p>
            <p className="font-bold text-sm text-gray-900">{player.age}</p>
          </div>
        </div>

        {/* Feature Player Button */}
        {team && (
          <div className="pt-3 border-t border-gray-200">
            <UpdateFeaturePlayer player={player} team={team} />
          </div>
        )}
        {isShowUpdate && (
          <div className=" flex justify-end">
            <UpdatePlayer player={player} buttonType={"ghost"} />
          </div>
        )}
        {/* Accent Line */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 ${THEME.PLAYER.GRADIENT}`}
        />
      </div>
    </>
  )

  // If team is defined, don't wrap in Link (admin view)
  if (team) {
    return (
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:scale-105">
        {cardContent}
      </div>
    )
  }

  // If no team prop, it's public view - make it clickable
  return (
    <Link
      href={`/players/${player.id}`}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:scale-105 cursor-pointer block"
    >
      {cardContent}
    </Link>
  )
}