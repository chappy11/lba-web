"use client"

import { Team } from "@/_lib/dto/MatchSchedule"
import { getTeamById } from "@/_lib/server/team"
import Image from "next/image"
import { useEffect, useState } from "react"

type Props = {
  teamId: string
}

export default function GetTeamInfo(props: Props) {
  const { teamId } = props
  const [team, setTeam] = useState<Team | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const resp = await getTeamById(teamId)

      setTeam(resp)
    } catch (error) {
      console.log("Error fetching team info", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
    
    console.log(team)

  return (
    <div className="flex items-center gap-4">
      {isLoading && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-white/80">Loading team...</p>
        </div>
      )}
      {!isLoading && team && (
        <>
          {team.teamLogo && (
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md" />
              <Image
                src={team.teamLogo}
                alt="Team"
                width={60}
                height={60}
                className="relative rounded-full ring-2 ring-white/50 object-cover shadow-lg"
              />
            </div>
          )}
          <div>
            <p className="text-xs text-white/70 font-medium">Playing for</p>
            <p className="text-xl font-bold text-white">{team.teamName}</p>
          </div>
        </>
      )}
    </div>
  )
}
