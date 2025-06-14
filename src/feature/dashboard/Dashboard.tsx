"use client"
import { Calendar, MapPin, Menu, Trophy, Users, X } from "lucide-react"
import { useState } from "react"

// Sample data with more realistic NBA-style teams
const upcomingGames = [
  {
    id: 1,
    homeTeam: "Golden State Warriors",
    awayTeam: "Los Angeles Lakers",
    date: "2025-05-20",
    time: "8:00 PM",
    venue: "Chase Center",
    homeTeamLogo: "/api/placeholder/80/80",
    awayTeamLogo: "/api/placeholder/80/80",
    featured: true,
  },
  {
    id: 2,
    homeTeam: "Miami Heat",
    awayTeam: "Boston Celtics",
    date: "2025-05-22",
    time: "7:30 PM",
    venue: "FTX Arena",
    homeTeamLogo: "/api/placeholder/80/80",
    awayTeamLogo: "/api/placeholder/80/80",
    featured: false,
  },
  {
    id: 3,
    homeTeam: "Phoenix Suns",
    awayTeam: "Denver Nuggets",
    date: "2025-05-25",
    time: "9:00 PM",
    venue: "Footprint Center",
    homeTeamLogo: "/api/placeholder/80/80",
    awayTeamLogo: "/api/placeholder/80/80",
    featured: false,
  },
]

const recentResults = [
  {
    id: 1,
    homeTeam: "Lakers",
    awayTeam: "Warriors",
    homeScore: 118,
    awayScore: 112,
    date: "2025-05-15",
    mvp: {
      name: "Kobe Bryant",
      number: "11",
      stats: {
        pts: 32,
        rbnd: 5,
        asst: 20,
        blck: 5,
      },
    },
    homeTeamLogo: "/api/placeholder/80/80",
    awayTeamLogo: "/api/placeholder/80/80",
  },
  {
    id: 2,
    homeTeam: "Celtics",
    awayTeam: "Heat",
    homeScore: 105,
    awayScore: 108,
    date: "2025-05-12",
    mvp: {
      name: "Jimmy Butler",
      number: "22",
      stats: {
        pts: 28,
        rbnd: 8,
        asst: 6,
        blck: 2,
      },
    },
    homeTeamLogo: "/api/placeholder/80/80",
    awayTeamLogo: "/api/placeholder/80/80",
  },
]

const GameCard = ({ game, isResult = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isResult) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
        {/* Game Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={game.awayTeamLogo}
                alt={game.awayTeam}
                className="w-16 h-16 rounded-full"
              />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {game.awayScore}
                </div>
                <div className="text-gray-400 text-sm">{game.awayTeam}</div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-gray-500 text-sm">
                {formatDate(game.date)}
              </div>
              <div className="text-gray-400 text-xs mt-1">FINAL</div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {game.homeScore}
                </div>
                <div className="text-gray-400 text-sm">{game.homeTeam}</div>
              </div>
              <img
                src={game.homeTeamLogo}
                alt={game.homeTeam}
                className="w-16 h-16 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* MVP Section */}
        <div className="bg-gray-800 p-6">
          <div className="text-center">
            <h3 className="text-gray-400 text-sm font-medium mb-2">
              MVP OF THE GAME
            </h3>
            <div className="text-6xl font-bold text-gray-500 mb-2">
              {game.mvp.number}
            </div>
            <div className="text-xl font-bold text-white mb-4">
              {game.mvp.name}
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {game.mvp.stats.pts}
                </div>
                <div className="text-gray-400 text-xs">PTS</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {game.mvp.stats.rbnd}
                </div>
                <div className="text-gray-400 text-xs">RBND</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {game.mvp.stats.asst}
                </div>
                <div className="text-gray-400 text-xs">ASST</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {game.mvp.stats.blck}
                </div>
                <div className="text-gray-400 text-xs">BLCK</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-gray-900 rounded-lg border border-gray-700 p-6 ${
        game.featured ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={game.awayTeamLogo}
            alt={game.awayTeam}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="text-white font-medium">{game.awayTeam}</div>
            <div className="text-gray-400 text-sm">Away</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-gray-500 text-sm">{formatDate(game.date)}</div>
          <div className="text-white font-medium">{game.time}</div>
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <div className="text-white font-medium">{game.homeTeam}</div>
            <div className="text-gray-400 text-sm">Home</div>
          </div>
          <img
            src={game.homeTeamLogo}
            alt={game.homeTeam}
            className="w-12 h-12 rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {game.venue}
        </div>
        {game.featured && (
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
            FEATURED
          </div>
        )}
      </div>
    </div>
  )
}

const StatsCard = ({ title, value, subtitle }) => (
  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-gray-400 text-sm">{title}</div>
    {subtitle && <div className="text-gray-500 text-xs mt-1">{subtitle}</div>}
  </div>
)

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-lg p-2 mr-3">
                <div className="text-white font-bold text-sm">
                  <div>LEAGUE BALL</div>
                  <div>ASSOCIATION</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-white px-3 py-2 text-sm font-medium"
                >
                  Basketball
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Teams
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Players
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Stats
                </a>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-400 hover:text-white"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#"
              className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="text-white block px-3 py-2 text-base font-medium"
            >
              Basketball
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
            >
              Teams
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
            >
              Players
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
            >
              Stats
            </a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">BASKETBALL</h1>
          <p className="text-xl text-gray-400">
            Professional Basketball League Schedule & Results
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8">
            {[
              {
                id: "upcoming",
                label: "Upcoming Games",
                icon: Calendar,
              },
              {
                id: "results",
                label: "Game Results",
                icon: Trophy,
              },
              {
                id: "standings",
                label: "League Standings",
                icon: Users,
              },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-white hover:border-gray-600"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* League Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Games Played"
            value="1,230"
            subtitle="This Season"
          />
          <StatsCard
            title="Total Points"
            value="134.5K"
            subtitle="Average per Game"
          />
          <StatsCard
            title="Active Teams"
            value="30"
            subtitle="Professional Teams"
          />
        </div>

        {/* Content Sections */}
        {activeTab === "upcoming" && (
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Upcoming Games</h2>
              <p className="text-gray-400">Next matchups in the schedule</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {upcomingGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}

        {activeTab === "results" && (
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Game Results</h2>
              <p className="text-gray-400">
                Recent completed games with MVP highlights
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {recentResults.map((game) => (
                <GameCard key={game.id} game={game} isResult={true} />
              ))}
            </div>
          </section>
        )}

        {activeTab === "standings" && (
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">League Standings</h2>
              <p className="text-gray-400">
                Current season standings by conference
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Eastern Conference</h3>
                <div className="space-y-3">
                  {[
                    {
                      team: "Boston Celtics",
                      wins: 45,
                      losses: 12,
                      pct: ".789",
                    },
                    {
                      team: "Miami Heat",
                      wins: 41,
                      losses: 16,
                      pct: ".719",
                    },
                    {
                      team: "Philadelphia 76ers",
                      wins: 38,
                      losses: 19,
                      pct: ".667",
                    },
                    {
                      team: "Milwaukee Bucks",
                      wins: 35,
                      losses: 22,
                      pct: ".614",
                    },
                  ].map((team, index) => (
                    <div
                      key={team.team}
                      className="flex items-center justify-between py-2 border-b border-gray-800 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <span className="w-8 text-center text-gray-400">
                          {index + 1}
                        </span>
                        <span className="text-white ml-4">{team.team}</span>
                      </div>
                      <div className="flex space-x-8 text-sm">
                        <span className="text-gray-300">
                          {team.wins}-{team.losses}
                        </span>
                        <span className="text-gray-400">{team.pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="bg-blue-600 rounded-lg p-3 inline-block mb-4">
              <div className="text-white font-bold text-sm">
                <div>LEAGUE BALL</div>
                <div>ASSOCIATION</div>
              </div>
            </div>
            <p className="text-gray-400">
              &copy; 2025 League Ball Association. All rights reserved.
            </p>
            <p className="text-gray-500 mt-2">
              Professional Basketball at its finest
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
