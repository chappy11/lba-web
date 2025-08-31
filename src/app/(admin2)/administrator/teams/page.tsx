import { getCurrentTeamFromThisSeason } from "@/_lib/server/team";
import Header from "@/components/header";
import TeamsList from "@/feature/teams/TeamsList";

export default async function Teams(){
    const teams = await getCurrentTeamFromThisSeason();
    return (
      <div className=" w-full flex-1  h-full z-100">
        <div className=" w-[60%] mx-auto mt-5">
          <Header
            title="Teams List"
            createButtonName="Create Team"
            link="/administrator/teams/create"
          />
          <TeamsList data={teams} />
        </div>
      </div>
    )
}