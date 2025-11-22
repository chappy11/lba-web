"use client"

import { Team } from "@/_lib/dto/Team.model"
import { DateFormatEnum } from "@/_lib/enums/DateFormatEnum.enum"
import { formatDate } from "@/_lib/utils/date.utils"

import { SECTION_BG, THEME } from "@/lib/theme"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import BatchUploadTeam from "../TeamManagement/BatchUploadTeam"

enum SortDirectionEnum {
  ASC = "ascending",
  DESC = "descending",
}

type SortConfig = {
  key: string
  direction: SortDirectionEnum
}

type Props = {
  data: Array<Team>
}

export default function SeasonList(props: Props) {
  // Sample data

  // State for data, sorting, pagination, and search
  const [data, setData] = useState<Array<Team>>(props.data)
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "id",
    direction: SortDirectionEnum.ASC,
  })
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const itemsPerPage = 5

  // Sorting logic
  const requestSort = (key: string) => {
    let direction: SortDirectionEnum = SortDirectionEnum.ASC
    if (
      sortConfig.key === key &&
      sortConfig.direction === SortDirectionEnum.ASC
    ) {
      direction = SortDirectionEnum.DESC
    }
    setSortConfig({ key, direction })
  }

  // Get sorted data
  const getSortedData = () => {
    let sortableItems = [...data]

    // Apply search filter
    if (searchTerm) {
      sortableItems = sortableItems.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Apply sorting
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }

  const sortedData = getSortedData()

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Get sort icon
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="inline h-4 w-4 text-gray-400" />
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="inline h-4 w-4 text-purple-600" />
    ) : (
      <ChevronDown className="inline h-4 w-4 text-purple-600" />
    )
  }

  // // Handle search
  // const handleSearch = (e: string) => {
  //   setSearchTerm(e)
  //   setCurrentPage(1) // Reset to first page on search
  // }

  // // Status badge
  // const StatusBadge = ({ status }: { status: string }) => {
  //   return (
  //     <span
  //       className={`px-2 py-1 rounded-full text-xs font-medium ${
  //         status === "Active"
  //           ? "bg-green-100 text-green-800"
  //           : "bg-red-100 text-red-800"
  //       }`}
  //     >
  //       {status}
  //     </span>
  //   )
  // }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-t-2xl border border-gray-200 border-b-0 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Teams List</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {sortedData.length} team
              {sortedData.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href={"/administrator/teams/create"}
            className={`inline-flex items-center gap-2 ${THEME.TEAMS.GRADIENT} text-white px-6 py-2.5 rounded-lg text-sm font-semibold ${THEME.TEAMS.GRADIENT_HOVER} transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Team
          </Link>
          <BatchUploadTeam />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Logo
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => requestSort("teamName")}
                >
                  <div className="flex items-center gap-2">
                    Team Name {getSortIcon("teamName")}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Coach
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => requestSort("dateCreate")}
                >
                  <div className="flex items-center gap-2">
                    Date Created {getSortIcon("dateCreate")}
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:${
                      SECTION_BG.PURPLE
                    } transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative group">
                        <div
                          className={`h-16 w-16 rounded-full ${SECTION_BG.PURPLE} p-1 ring-2 ring-purple-200 group-hover:ring-purple-400 transition-all`}
                        >
                          {item.teamLogo ? (
                            <Image
                              src={item.teamLogo}
                              alt="team logo"
                              width={64}
                              height={64}
                              className="rounded-full object-cover w-full h-full"
                            />
                          ) : (
                            <Image
                              src={"/NoTeam.png"}
                              alt="team logo"
                              width={64}
                              height={64}
                              className="rounded-full object-cover w-full h-full"
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {item.teamName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">
                          {item.coachInfo.firstname} {item.coachInfo.middlename}{" "}
                          {item.coachInfo.lastname}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {item.dateCreate
                          ? formatDate(
                              item.dateCreate,
                              DateFormatEnum.FORMAT_USER
                            )
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Link
                        href={`/administrator/teams/team-profile?id=${item.id}`}
                        className={`inline-flex items-center gap-2 ${THEME.TEAMS.GRADIENT} text-white px-4 py-2 rounded-lg text-sm font-medium ${THEME.TEAMS.GRADIENT_HOVER} transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 rounded-full p-4 mb-4">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">
                        No results found
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting your search
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white border border-gray-200 border-t-0 rounded-b-2xl px-6 py-4 mt-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-bold text-purple-600">
                {indexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-purple-600">
                {Math.min(indexOfLastItem, sortedData.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-purple-600">
                {sortedData.length}
              </span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-xl shadow-md"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-xl px-3 py-2 transition-all ${
                  currentPage === 1
                    ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                    : `${THEME.TEAMS.TEXT} bg-white hover:${SECTION_BG.PURPLE} cursor-pointer border ${THEME.TEAMS.BORDER}`
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all ${
                      currentPage === page
                        ? `z-10 ${THEME.TEAMS.GRADIENT} text-white shadow-lg`
                        : `text-gray-700 bg-white hover:${SECTION_BG.PURPLE} border border-gray-200`
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-xl px-3 py-2 transition-all ${
                  currentPage === totalPages
                    ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                    : `${THEME.TEAMS.TEXT} bg-white hover:${SECTION_BG.PURPLE} cursor-pointer border ${THEME.TEAMS.BORDER}`
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
