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
    <div className=" flex flex-row gap-5 items-center">
      {isLoading && <p>Loading...</p>}
      {team?.teamLogo && (
        <Image src={team.teamLogo} alt="Team" width={50} height={50} />
      )}
      <p>{team?.teamName}</p>
    </div>
  )
}
