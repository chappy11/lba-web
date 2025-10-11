import NavigationHeader from "@/components/navigation-header";
import CarouselTeam from "./(dashboardComponent)/@CarouselTeams/page"
import NumberOfPlayerComponent from "./(dashboardComponent)/@NumberOfPlayers/page";
import NumberOfTeam from "./(dashboardComponent)/@NumberOfTeam/page";
import TotalNumberOfTeams from "./(dashboardComponent)/@TotalNumberOfTeams/page";
import UpcomingGames from "./(dashboardComponent)/@UpcomingGames/page";

export default function Home() {
	return (
    <div className="flex flex-1 flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <NavigationHeader />

      {/* Hero Section with Banner */}
      <div
        className="relative h-[500px] md:h-[600px] w-full bg-cover bg-center bg-fixed transition-all duration-300"
        style={{ backgroundImage: "url('/bannerhome.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative h-full w-full flex items-center justify-center px-4">
          <div className="w-full max-w-4xl">
            <UpcomingGames />
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        {/* Teams Carousel Section */}
        <div className="mb-10 transform transition-all duration-500 hover:scale-[1.01]">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Teams
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
            </div>
            <CarouselTeam />
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              League Statistics
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <NumberOfPlayerComponent />
            </div>
            <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <NumberOfTeam />
            </div>
            <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <TotalNumberOfTeams />
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mb-12 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Professional Basketball League
          </h3>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Experience the thrill of competitive basketball. Follow your
            favorite teams, track player statistics, and stay updated with live
            scores and schedules.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
              <p className="text-sm text-gray-400">Season</p>
              <p className="text-2xl font-bold text-white">2024-2025</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
              <p className="text-sm text-gray-400">Status</p>
              <p className="text-2xl font-bold text-green-400">Active</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Spacer */}
      <div className="h-20" />
    </div>
  )
}
