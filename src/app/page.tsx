import NavigationHeader from "@/components/navigation-header"
import NumberOfPlayerComponent from "./(dashboardComponent)/@NumberOfPlayers/page"
import NumberOfTeam from "./(dashboardComponent)/@NumberOfTeam/page"
import TotalNumberOfTeams from "./(dashboardComponent)/@TotalNumberOfTeams/page"

export default function Home() {
  return (
    <div className=" flex flex-1  flex-col">
      <NavigationHeader />
      <main className="w-[50%] mx-auto mt-6">
        <div className="flex flex-row justify-between items-center gap-3 mb-6  w-full">
          <NumberOfPlayerComponent />
          <NumberOfTeam />
          <TotalNumberOfTeams />
        </div>
      </main>
    </div>
  )
}
