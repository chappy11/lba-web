import NavigationHeader from "@/components/navigation-header";
import NumberOfPlayerComponent from "./(dashboardComponent)/@NumberOfPlayers/page";
import NumberOfTeam from "./(dashboardComponent)/@NumberOfTeam/page";
import TotalNumberOfTeams from "./(dashboardComponent)/@TotalNumberOfTeams/page";
import UpcomingGames from "./(dashboardComponent)/@UpcomingGames/page";

export default function Home() {
	return (
		<div className=" flex flex-1  flex-col">
			<NavigationHeader />
			<section className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h1 className="text-5xl font-bold mb-4">
						BASKETBALL
					</h1>
					<p className="text-xl text-gray-400">
						Professional Basketball
						League Schedule & Results
					</p>
				</div>
			</section>
			<main className="w-[50%] mx-auto mt-6">
				<div className="flex flex-row justify-between items-center gap-3 mb-6  w-full">
					<NumberOfPlayerComponent />
					<NumberOfTeam />
					<TotalNumberOfTeams />
				</div>
				<UpcomingGames />
			</main>
		</div>
	);
}
