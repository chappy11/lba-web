import Header from "@/components/header";
import CreateTeam from "@/feature/teams/CreateTeams";

export default function Page() {
    return (
      <div className=" w-full">
        <div className=" w-[50%] mt-5 mx-auto shadow-md bg-white rounded-lg">
          <Header title="Create Teams" />
          <div className=" w-full ">
            <CreateTeam />
          </div>
        </div>
      </div>
    )
 
}
