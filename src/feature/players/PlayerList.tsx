"use client";

import { PlayerResponse } from "@/_lib/dto/Player.model";
import { SECTION_BG, THEME } from "@/lib/theme"
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsUpDown,
	ChevronUp,
} from "lucide-react";
import Link from "next/link";
import {
	useMemo,
	useState,
} from "react";

enum SortDirectionEnum {
	ASC = "ascending",
	DESC = "descending",
}

type SortConfig = {
	key: string;
	direction: SortDirectionEnum;
};

type Props = {
	players: Array<PlayerResponse>;
};

export default function PlayerList(
	props: Props
) {
	const [data, setData] = useState<
		PlayerResponse[]
	>(props.players);

	const [sortConfig, setSortConfig] =
		useState<SortConfig>({
			key: "id",
			direction: SortDirectionEnum.ASC,
		});
	const [currentPage, setCurrentPage] =
		useState<number>(1);
	const [searchTerm, setSearchTerm] =
		useState<string>("");
	const itemsPerPage = 5;

	// Sorting logic
	const requestSort = (key: string) => {
		let direction: SortDirectionEnum =
			SortDirectionEnum.ASC;
		if (
			sortConfig.key === key &&
			sortConfig.direction ===
				SortDirectionEnum.ASC
		) {
			direction =
				SortDirectionEnum.DESC;
		}
		setSortConfig({ key, direction });
	};

	// Get sorted data
	const getSortedData = () => {
		let sortableItems = [...data];

		// Apply search filter
		if (searchTerm) {
			sortableItems =
				sortableItems.filter((item) =>
					Object.values(item).some(
						(value) =>
							value
								.toString()
								.toLowerCase()
								.includes(
									searchTerm.toLowerCase()
								)
					)
				);
		}

		// Apply sorting
		if (sortConfig.key) {
			sortableItems.sort((a, b) => {
				if (
					a[sortConfig.key] <
					b[sortConfig.key]
				) {
					return sortConfig.direction ===
						"ascending"
						? -1
						: 1;
				}
				if (
					a[sortConfig.key] >
					b[sortConfig.key]
				) {
					return sortConfig.direction ===
						"ascending"
						? 1
						: -1;
				}
				return 0;
			});
		}
		return sortableItems;
	};

	const sortedData = getSortedData();

	// Pagination logic
	const indexOfLastItem =
		currentPage * itemsPerPage;
	const indexOfFirstItem =
		indexOfLastItem - itemsPerPage;
	const currentItems = sortedData.slice(
		indexOfFirstItem,
		indexOfLastItem
	) as PlayerResponse[];
	const totalPages = Math.ceil(
		sortedData.length / itemsPerPage
	);

	// Handle page change
	const handlePageChange = (
		pageNumber: number
	) => {
		setCurrentPage(pageNumber);
	};

	// Get sort icon
	const getSortIcon = (key: string) => {
		if (sortConfig.key !== key) {
			return (
				<ChevronsUpDown className="inline h-4 w-4 text-gray-400" />
			);
		}
		return sortConfig.direction ===
			"ascending" ? (
			<ChevronUp className="inline h-4 w-4 text-blue-500" />
		) : (
			<ChevronDown className="inline h-4 w-4 text-blue-500" />
		);
	};

	const displayData = useMemo(() => {
    if (currentItems.length < 1) {
      return (
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No players found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search
              </p>
            </div>
          </td>
        </tr>
      )
    }

    return currentItems.map((item: PlayerResponse, index: number) => {
      return (
        <tr
          key={item.id}
          className={`hover:${SECTION_BG.RED} transition-all duration-200 ${
            index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
          }`}
        >
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`inline-flex items-center justify-center ${THEME.PLAYER.GRADIENT} text-white w-10 h-10 rounded-full font-bold shadow-md`}
            >
              {item.jerseyNumber}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-semibold text-gray-900">
              {item.firstname.toUpperCase()} {item.middlename.toUpperCase()}{" "}
              {item.lastname.toUpperCase()}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-700 font-medium">
              {item?.team?.teamName || (
                <span className="text-gray-400 italic">No team</span>
              )}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {item?.position}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center">
            <Link
              href={`/administrator/players/view-players?id=${item.id}`}
              className={`inline-flex items-center gap-2 ${THEME.PLAYER.GRADIENT} text-white px-4 py-2 rounded-lg text-sm font-medium ${THEME.PLAYER.GRADIENT_HOVER} transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg`}
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
      )
    })
  }, [currentItems])

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-t-2xl border border-gray-200 border-b-0 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Players List</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {sortedData.length} player
              {sortedData.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className={`h-1 w-24 ${THEME.PLAYER.GRADIENT} rounded-full`} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => requestSort("jerseyNumber")}
                >
                  <div className="flex items-center gap-2">
                    Jersey NO. {getSortIcon("jerseyNumber")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => requestSort("firstname")}
                >
                  <div className="flex items-center gap-2">
                    Player Name {getSortIcon("firstname")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => requestSort("teamName")}
                >
                  <div className="flex items-center gap-2">
                    Team Name {getSortIcon("teamName")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => requestSort("position")}
                >
                  <div className="flex items-center gap-2">
                    Position {getSortIcon("position")}
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {displayData}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-semibold text-red-600">
                {indexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-red-600">
                {Math.min(indexOfLastItem, sortedData.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-red-600">
                {sortedData.length}
              </span>{" "}
              players
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex gap-1 rounded-lg"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-lg px-3 py-2 transition-all ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed bg-gray-50"
                    : `text-gray-700 hover:${THEME.PLAYER.GRADIENT} hover:text-white cursor-pointer bg-white border border-gray-300`
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
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                      currentPage === page
                        ? `${THEME.PLAYER.GRADIENT} text-white shadow-md`
                        : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
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
                className={`relative inline-flex items-center rounded-lg px-3 py-2 transition-all ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed bg-gray-50"
                    : `text-gray-700 hover:${THEME.PLAYER.GRADIENT} hover:text-white cursor-pointer bg-white border border-gray-300`
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
