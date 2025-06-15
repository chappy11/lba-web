"use client";

import { PlayerResponse } from "@/_lib/dto/Player.model";
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

	// Handle search
	const handleSearch = (e: string) => {
		setSearchTerm(e);
		setCurrentPage(1); // Reset to first page on search
	};

	// Status badge
	const StatusBadge = ({
		status,
	}: {
		status: string;
	}) => {
		return (
			<span
				className={`px-2 py-1 rounded-full text-xs font-medium ${
					status === "Active"
						? "bg-green-100 text-green-800"
						: "bg-red-100 text-red-800"
				}`}
			>
				{status}
			</span>
		);
	};

	const displayData = useMemo(() => {
		if (currentItems.length < 1) {
			return (
				<tr>
					<td
						colSpan={5}
						className="px-6 py-4 text-center text-sm text-gray-500"
					>
						No results found
					</td>
				</tr>
			);
		}

		return currentItems.map(
			(item: PlayerResponse) => {
				return (
					<tr
						key={item.id}
						className="hover:bg-gray-50 transition-colors duration-150"
					>
						<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{item.jerseyNumber}
						</td>
						<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{item.firstname}{" "}
							{item.middlename}{" "}
							{item.lastname}
						</td>
						<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{item?.team?.teamName ||
								""}
						</td>

						<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{item?.position}
						</td>
						<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
							<Link
								href={`/administrator/teams/team-profile?id=${item.id}`}
								className="text-blue-600 hover:text-blue-900"
							>
								View
							</Link>
						</td>
					</tr>
				);
			}
		);
	}, [currentItems]);

	return (
		<div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-lg shadow">
			{/* <div className="mb-4 flex justify-between items-center">
				<h2 className="text-xl font-bold text-gray-800">
					Team Members
				</h2>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search..."
						className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={searchTerm}
						onChange={(e) =>
							handleSearch(
								e.target.value
							)
						}
					/>
				</div>
			</div> */}

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
								onClick={() =>
									requestSort(
										"teamName"
									)
								}
							>
								Jersey NO.
							</th>
							<th
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
								onClick={() =>
									requestSort(
										"teamName"
									)
								}
							>
								Player Name
							</th>
							<th
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
								onClick={() =>
									requestSort(
										"teamName"
									)
								}
							>
								Team Name
								{getSortIcon(
									"teamName"
								)}
							</th>
							<th
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
								onClick={() =>
									requestSort(
										"teamName"
									)
								}
							>
								Position
							</th>
							<th
								className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
								onClick={() =>
									requestSort("status")
								}
							></th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{displayData}
						{/* {currentItems.length > 0 ? (
							currentItems.map(
								
									item
								 => (
									<tr
										key={
											item.jerseyNumber
										}
										className="hover:bg-gray-50 transition-colors duration-150"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{item.firstname}{" "}
											{item.middlename}{" "}
											{item.lastname}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{
												item.team
													.teamName
											}
										</td>
                                        <td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										    {item.position}
                                            </td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											<Link
												href={`/administrator/teams/team-profile?id=${item.id}`}
												className="text-blue-600 hover:text-blue-900"
											>
												View
											</Link>
										</td>
									</tr>
								)
							)
						) : (
							<tr>
								<td
									colSpan={5}
									className="px-6 py-4 text-center text-sm text-gray-500"
								>
									No results found
								</td>
							</tr>
						)}} */}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
				<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
					<div>
						<p className="text-sm text-gray-700">
							Showing{" "}
							<span className="font-medium">
								{indexOfFirstItem + 1}
							</span>{" "}
							to{" "}
							<span className="font-medium">
								{Math.min(
									indexOfLastItem,
									sortedData.length
								)}
							</span>{" "}
							of{" "}
							<span className="font-medium">
								{sortedData.length}
							</span>{" "}
							results
						</p>
					</div>
					<div>
						<nav
							className="isolate inline-flex -space-x-px rounded-md shadow-sm"
							aria-label="Pagination"
						>
							<button
								onClick={() =>
									handlePageChange(
										Math.max(
											1,
											currentPage - 1
										)
									)
								}
								disabled={
									currentPage === 1
								}
								className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
									currentPage === 1
										? "text-gray-300 cursor-not-allowed"
										: "text-gray-500 hover:bg-gray-50 cursor-pointer"
								}`}
							>
								<ChevronLeft className="h-5 w-5" />
							</button>

							{/* Page numbers */}
							{Array.from(
								{ length: totalPages },
								(_, i) => i + 1
							).map((page) => (
								<button
									key={page}
									onClick={() =>
										handlePageChange(
											page
										)
									}
									className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
										currentPage === page
											? "z-10 bg-blue-600 text-white"
											: "text-gray-500 hover:bg-gray-50"
									}`}
								>
									{page}
								</button>
							))}

							<button
								onClick={() =>
									handlePageChange(
										Math.min(
											totalPages,
											currentPage + 1
										)
									)
								}
								disabled={
									currentPage ===
									totalPages
								}
								className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
									currentPage ===
									totalPages
										? "text-gray-300 cursor-not-allowed"
										: "text-gray-500 hover:bg-gray-50 cursor-pointer"
								}`}
							>
								<ChevronRight className="h-5 w-5" />
							</button>
						</nav>
					</div>
				</div>
			</div>
		</div>
	);
}
