import { ArrowLeft, Users } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mb-6">
            <Users className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-3">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Team Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the team you&apos;re looking for. It
            may have been removed or doesn&apos;t exist.
          </p>
        </div>

        <Link
          href="/teams"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Teams
        </Link>
      </div>
    </div>
  )
}
