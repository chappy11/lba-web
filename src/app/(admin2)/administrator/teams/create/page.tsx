import CreateTeam from "@/feature/teams/CreateTeams"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Decorative header accent */}
        <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-6 mx-auto" />

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="w-full">
            <CreateTeam />
          </div>
        </div>
      </div>
    </div>
  )
}
