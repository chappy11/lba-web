import { Team } from "@/_lib/dto/Team.model";
import { Trophy, Users } from "lucide-react"
import Image from "next/image";
import Link from "next/link"

type Props = {
	teamList: Team[];
};

export default function TeamDashboard(
	props: Props
) {
	const { teamList } = props;

	return teamList.map((team: Team) => (
    <Link
      href={`/teams/${team?.id}`}
      className="group relative flex-col w-[280px] bg-white p-6 shadow-lg hover:shadow-2xl rounded-2xl flex justify-center items-center transition-all duration-300 hover:scale-105 border border-gray-200 overflow-hidden cursor-pointer"
      key={team?.id}
    >
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Team Logo */}
      <div className="relative z-10 mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
        <div className="relative p-2 bg-white rounded-full shadow-md ring-4 ring-gray-100 group-hover:ring-purple-200 transition-all">
          <Image
            src={team?.teamLogo}
            alt={team?.teamName}
            width={160}
            height={160}
            className="rounded-full object-cover"
          />
        </div>
      </div>

      {/* Team Name */}
      <h3 className="relative z-10 text-xl text-gray-900 uppercase font-black text-center mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 transition-all">
        {team?.teamName}
      </h3>

      {/* Team Stats */}
      <div className="relative z-10 w-full flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">Team</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
          <Trophy className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-gray-700">Active</span>
        </div>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  ))
}
