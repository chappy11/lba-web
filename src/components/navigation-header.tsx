"use client";

import { THEME } from "@/lib/theme"
import {
  BarChart3,
  Home,
  LogIn,
  Menu,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react";

export default function NavigationHeader() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/teams", label: "Teams", icon: Users },
    { href: "/standing", label: "Standings", icon: TrendingUp },
    { href: "/match-result", label: "Match Result", icon: BarChart3 },
    { href: "/players", label: "Players", icon: Trophy },
  ]

	return (
    <div className="w-full sticky top-0 z-50">
      {/* Main Navigation */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className={`${THEME.INFO.GRADIENT} rounded-xl p-2.5 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
              >
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-black text-gray-900 leading-tight">
                  LBA
                </div>
                <div className="text-xs font-semibold text-gray-600 -mt-0.5">
                  League Basketball
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      isActive
                        ? `${THEME.INFO.GRADIENT} text-white shadow-md`
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}

              {/* Login Button */}
              <Link
                href="/auth/login"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm ${THEME.TEAMS.GRADIENT} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ml-2`}
              >
                <LogIn className="w-4 h-4" />
                Admin Login
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Decorative Bottom Gradient Bar */}
        <div className={`h-1 ${THEME.INFO.GRADIENT}`}></div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isActive
                      ? `${THEME.INFO.GRADIENT} text-white shadow-md`
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}

            {/* Mobile Login Button */}
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold ${THEME.TEAMS.GRADIENT} text-white shadow-lg mt-2`}
            >
              <LogIn className="w-5 h-5" />
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
