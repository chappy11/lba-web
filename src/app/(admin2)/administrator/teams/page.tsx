import { getCurrentTeamFromThisSeason } from "@/_lib/server/team"
import TeamsList from "@/feature/teams/TeamsList"

export default async function Teams() {
  const teams = await getCurrentTeamFromThisSeason()
  return (
    <div className=" w-full flex-1  h-full z-100">
      <div className=" w-[60%] mx-auto mt-5">
        <TeamsList data={teams} />
      </div>
    </div>
  )
}
