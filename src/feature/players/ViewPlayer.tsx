"use client";

import { Player } from "@/_lib/dto/Player.model";
import { PlayerMvp } from "@/_lib/dto/PlayerMvp.model";
import { getPlayerMvpByPlayerId } from "@/_lib/server/playermvp";
import { PositionEnum } from "@/_lib/type/Position.enum";
import { Calendar, Ruler, TrendingUp, Trophy, User, Weight } from "lucide-react"
import Image from "next/image";
import { useEffect, useState } from "react";
import GetTeamInfo from "./GetTeamInfo";

type Props = {
  data: Player
}

export default function ViewPlayer(props: Props) {
    const { data } = props
    const [playerMvp, setPlayerMvp] = useState<PlayerMvp[]>([]);

    const fetchData = async () => { 
        try {
            const resp = await getPlayerMvpByPlayerId(data.id as string)
            setPlayerMvp(resp)
        } catch (error) {
            console.log("Error fetching player mvp", error)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])
    

  return (
    <div className="space-y-6">
      {/* Hero Section with Player Profile */}
      <div className="bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Player Image */}
            <div className="relative group">
              {data?.playerImage ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <Image
                    src={data.playerImage}
                    alt="Player"
                    width={250}
                    height={250}
                    className="relative rounded-2xl shadow-2xl ring-4 ring-white/50 object-cover"
                  />
                </div>
              ) : (
                <div className="w-[250px] h-[250px] bg-white/20 rounded-2xl flex items-center justify-center">
                  <User className="w-32 h-32 text-white/50" />
                </div>
              )}
              {/* Jersey Number Badge */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white">
                <span className="text-3xl font-black text-gray-900">
                  {data.jerseyNumber}
                </span>
              </div>
            </div>

            {/* Player Details */}
            <div className="flex-1 text-white space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black mb-2 drop-shadow-lg">
                  {data.firstname.toUpperCase()} {data.middlename.toUpperCase()}{" "}
                  {data.lastname.toUpperCase()}
                </h1>
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <p className="text-lg font-semibold">
                    {PositionEnum[data.position]}
                  </p>
                </div>
              </div>

              {/* Team Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <GetTeamInfo teamId={data.teamId} />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Calendar className="w-5 h-5 mb-1 text-yellow-300" />
                  <p className="text-2xl font-bold">{data.age}</p>
                  <p className="text-xs text-white/80">Years Old</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Ruler className="w-5 h-5 mb-1 text-yellow-300" />
                  <p className="text-2xl font-bold">{data.height ?? "0"}</p>
                  <p className="text-xs text-white/80">cm Height</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Weight className="w-5 h-5 mb-1 text-yellow-300" />
                  <p className="text-2xl font-bold">{data.weight ?? "0"}</p>
                  <p className="text-xs text-white/80">kg Weight</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Trophy className="w-5 h-5 mb-1 text-yellow-300" />
                  <p className="text-2xl font-bold">{playerMvp.length}</p>
                  <p className="text-xs text-white/80">MVP Awards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player Information Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Player Information
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium">Position</span>
                <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold">
                  {PositionEnum[data.position]}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium">Jersey Number</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">
                  #{data.jerseyNumber}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium">Age</span>
                <span className="text-xl font-bold text-gray-900">
                  {data.age} years
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium">Height</span>
                <span className="text-xl font-bold text-gray-900">
                  {data.height ?? "0"} cm
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium">Weight</span>
                <span className="text-xl font-bold text-gray-900">
                  {data.weight ?? "0"} kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* MVP Count */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 shadow-xl">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                      <Trophy className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <p className="text-white/90 font-medium">
                        Total MVP Awards
                      </p>
                      <p className="text-6xl font-black text-white">
                        {playerMvp.length}
                      </p>
                    </div>
                  </div>
                  {playerMvp.length > 0 && (
                    <div className="flex items-center gap-2 text-white">
                      <TrendingUp className="w-5 h-5" />
                      <p className="font-semibold">Outstanding Performance!</p>
                    </div>
                  )}
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              </div>

              {/* Additional Stats Placeholder */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-gray-600 mb-1">Status</p>
                  <p className="text-lg font-bold text-blue-600">Active</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <p className="text-xs text-gray-600 mb-1">Performance</p>
                  <p className="text-lg font-bold text-green-600">Elite</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
