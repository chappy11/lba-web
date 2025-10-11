"use client"

import { createMatchSchedule } from "@/_lib/server/matchSchedule"
import LoadingScreen from "@/components/loading-screen"
import { CalendarPlus, Sparkles } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function GenerateMatchSchedule() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function handleGenerateSchedule() {
    try {
      setIsLoading(true)
      const resp = await createMatchSchedule()

      if (resp) {
        toast.success("Match schedule generated successfully")
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {isLoading && <LoadingScreen />}

      {/* Icon */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-xl mb-6">
        <CalendarPlus className="w-16 h-16 text-white" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">
        Generate Match Schedule
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-center max-w-md mb-8">
        Click the button below to automatically generate a Round Robin match
        schedule for all teams in the current season.
      </p>

      {/* Features List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl">
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
          <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm font-semibold text-gray-800">Automatic</p>
          <p className="text-xs text-gray-600 mt-1">AI-generated schedule</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
          <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800">Fair Play</p>
          <p className="text-xs text-gray-600 mt-1">Balanced matchups</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
          <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800">Fast Setup</p>
          <p className="text-xs text-gray-600 mt-1">Instant generation</p>
        </div>
      </div>

      {/* Button */}
      <button
        className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        onClick={() => handleGenerateSchedule()}
        disabled={isLoading}
      >
        <span className="flex items-center gap-2">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <CalendarPlus className="w-5 h-5" />
              Generate Schedule
            </>
          )}
        </span>
        {!isLoading && (
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300" />
        )}
      </button>

      {/* Info Note */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-blue-900">Note</p>
            <p className="text-xs text-blue-800 mt-1">
              Make sure all teams are registered before generating the schedule.
              The schedule will include all active teams in the current season.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
