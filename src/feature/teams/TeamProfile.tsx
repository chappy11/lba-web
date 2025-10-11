import { Player } from "@/_lib/dto/Player.model";
import { Team } from "@/_lib/dto/Team.model";
import { getPlayerByTeams } from "@/_lib/server/player";
import PlayerCard from "@/components/player-card"
import { Award, Shield, Star, Users } from "lucide-react"
import Image from "next/image";
import { useEffect, useMemo, useState } from "react"
import { CreatePlayer } from "../players/CreatePlayer";

type Props = {
	data: Team;
};

export const TeamProfile = (
	props: Props
) => {
	const {
		teamLogo,
		teamName,
		coachInfo,
		id,
	} = props.data;
	const {
		firstname,
		middlename,
		lastname,
	} = coachInfo;
	const [data, setData] = useState<
		Array<Player>
	>([]);

	const sendRequest = async () => {
		try {
			const resp =
				await getPlayerByTeams(
					id as string
				);

			setData(resp);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		sendRequest();
	}, []);


  const displayFeaturePlayer = useMemo(() => {
    if (props.data.featurePlayer) {
      return (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-600" />
            <h3 className="font-bold text-gray-900">Featured Player</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-lg opacity-40" />
              <Image
                className="relative rounded-full ring-4 ring-white shadow-xl object-cover"
                src={props.data.featurePlayer.playerImage}
                width={120}
                height={120}
                alt="Feature Player"
              />
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
            <div className="flex flex-col text-center md:text-left">
              <h1 className="font-black text-2xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {props.data.featurePlayer.firstname}{" "}
                {props.data.featurePlayer.middlename}{" "}
                {props.data.featurePlayer.lastname}
              </h1>
              <div className="flex flex-col md:flex-row gap-2 mt-3">
                <div className="px-4 py-2 bg-white rounded-lg border border-yellow-200">
                  <p className="text-xs text-gray-600">Jersey Number</p>
                  <p className="text-lg font-bold text-yellow-600">
                    #{props.data.featurePlayer.jerseyNumber}
                  </p>
                </div>
                <div className="px-4 py-2 bg-white rounded-lg border border-yellow-200">
                  <p className="text-xs text-gray-600">Position</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {props.data.featurePlayer.position}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }, [])

  return (
    <div className="flex-1 space-y-6">
      <div className="w-full mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Team Logo */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative p-3 bg-white rounded-full shadow-2xl ring-4 ring-white/50">
                  <Image
                    className="rounded-full object-cover"
                    src={teamLogo}
                    width={140}
                    height={140}
                    alt="Team Logo"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Team Info */}
              <div className="flex-1 text-white text-center md:text-left">
                <h1 className="font-black text-4xl md:text-5xl mb-3 drop-shadow-lg">
                  {teamName.toUpperCase()}
                </h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 inline-block">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-5 h-5 text-yellow-300" />
                    <p className="text-sm font-semibold text-white/90">
                      Head Coach
                    </p>
                  </div>
                  <h3 className="text-xl font-bold">
                    {firstname.toUpperCase()} {middlename.toUpperCase()}{" "}
                    {lastname.toUpperCase()}
                  </h3>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <Users className="w-6 h-6 mb-2 text-blue-300" />
                    <p className="text-2xl font-bold">{data.length}</p>
                    <p className="text-sm text-white/80">Players</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <Shield className="w-6 h-6 mb-2 text-green-300" />
                    <p className="text-2xl font-bold">Active</p>
                    <p className="text-sm text-white/80">Status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Player Section */}
        {props.data.featurePlayer && (
          <div className="mt-6">{displayFeaturePlayer}</div>
        )}

        {/* Players Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-6">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Team Roster
                </h2>
                <p className="text-sm text-gray-600">
                  {data.length} player{data.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <CreatePlayer teamId={id as string} />
          </div>

          <div className="p-6">
            {data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((item: Player) => {
                  return (
                    <PlayerCard
                      player={item}
                      team={props.data}
                      key={item.id as string}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-semibold">No players yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Add players to build your team
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
};
