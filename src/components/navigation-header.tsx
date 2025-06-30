"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function NavigationHeader() {
	const [activeTab, setActiveTab] =
		useState("upcoming");
	const [
		mobileMenuOpen,
		setMobileMenuOpen,
	] = useState(false);
	return (
		<div className=" w-full">
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
									href="/"
									className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
								>
									Home
								</a>
								<a
									href="/teams"
									className="text-white px-3 py-2 text-sm font-medium"
								>
									Teams
								</a>
								<a
									href="/standing"
									className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
								>
									Game Standings
								</a>
								<a
									href="/players"
									className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
								>
									Players
								</a>
							</div>
						</div>

						<div className="md:hidden">
							<button
								onClick={() =>
									setMobileMenuOpen(
										!mobileMenuOpen
									)
								}
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
			{mobileMenuOpen && (
				<div className="md:hidden bg-gray-900 border-b border-gray-800">
					<div className="px-2 pt-2 pb-3 space-y-1">
						<a
							href="/"
							className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
						>
							Home
						</a>
						<a
							href="/teams"
							className="text-white block px-3 py-2 text-base font-medium"
						>
							Teams
						</a>
						<a
							href="/standing"
							className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
						>
							Game Standings
						</a>
						<a
							href="/players"
							className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
						>
							Players
						</a>
					</div>
				</div>
			)}

			{/* Hero Section */}
			{/* Navigation Tabs */}
			{/* <nav className="border-b border-gray-800 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
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
        </nav> */}
		</div>
	);
}
