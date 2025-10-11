import { getAllPlayers } from "@/_lib/server/player"
import NavigationHeader from "@/components/navigation-header"
import PlayerDashboard from "@/feature/players/PlayerDashboard"
import { THEME } from "@/lib/theme"
import { Search, Users } from "lucide-react"

export default async function PlayersPage() {
  const resp = await getAllPlayers()
  console.log(resp)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <NavigationHeader />
      
      {/* Hero Header */}
      <div className="relative bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className={`${THEME.PLAYER.GRADIENT} p-4 rounded-xl shadow-lg`}>
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">All Players</h1>
              <p className="text-gray-600 mt-1">
                {resp.length} {resp.length === 1 ? 'Player' : 'Players'} in the League
              </p>
            </div>
          </div>
          <div className={`h-1 w-32 ${THEME.PLAYER.GRADIENT} rounded-full`} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3 text-gray-500">
            <Search className="w-5 h-5" />
            <p className="text-sm">
              Browse through our roster of talented players
            </p>
          </div>
        </div>

        {/* Players Grid */}
        <PlayerDashboard playerList={resp} />
      </div>
    </div>
  )
}
