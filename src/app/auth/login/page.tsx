"use client"
import { useEffect, useState } from "react"

import { login } from "@/_lib/server/user"
import { setSession } from "@/app/action"
import { BG, THEME } from "@/lib/theme"
import { ArrowRight, Lock, Mail, Sparkles, Trophy } from "lucide-react"
import Image from "next/image"
import Swal from "sweetalert2"

export default function Page() {
  const [email, setEmail] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")

  async function handleSubmit() {
    try {
      if (!email) {
        setEmailError("Email is required")
        return
      }
      if (!password) {
        setPasswordError("Password is required")
        return
      }

      const resp = await login(email, password)

      if (resp) {
        await setSession(JSON.stringify(resp))
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Login successful!",
        }).then(() => {
          window.location.href = "/dashboardv2"
        })
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid email or password!",
        })
      }
    } catch (error) {
           Swal.fire({
             icon: "error",
             title: "Oops...",
             text: "Invalid email or password!",
           })
      console.log(error)
    }
  }

  useEffect(() => {
    setEmailError("")
  }, [email])

  useEffect(() => {
    setPasswordError("")
  }, [password])

  return (
    <div
      className={`min-h-screen ${BG.GRADIENT} flex items-center justify-center p-4 relative overflow-hidden`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Left Side - Basketball Image with Overlay */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-indigo-600/90 to-blue-600/90 z-10"></div>
            <Image
              src={"/basketball.jpg"}
              width={800}
              height={800}
              alt="Basketball"
              className="w-full h-full object-cover"
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-12">
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
                  <div
                    className={`relative ${THEME.WARNING.GRADIENT} p-6 rounded-full shadow-2xl ring-4 ring-white/30`}
                  >
                    <Trophy className="w-16 h-16 text-white" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-4xl font-black uppercase tracking-tight">
                    LBA Admin
                  </h2>
                  <div
                    className={`h-1 w-32 ${THEME.WARNING.GRADIENT} rounded-full mx-auto`}
                  ></div>
                  <p className="text-lg text-white/90 font-medium">
                    League Basketball Association
                  </p>
                  <p className="text-sm text-white/70 max-w-sm mx-auto">
                    Manage your basketball league with powerful tools for teams,
                    players, schedules, and statistics.
                  </p>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3 justify-center pt-6">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Team Management
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                    <Trophy className="w-4 h-4 inline mr-2" />
                    Game Tracking
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Statistics
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={`${THEME.INFO.GRADIENT} p-2 rounded-lg`}>
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-black text-gray-900">Sign In</h1>
              </div>
              <p className="text-gray-600">
                Enter your credentials to access the admin dashboard
              </p>
              <div
                className={`h-1 w-24 ${THEME.INFO.GRADIENT} rounded-full mt-3`}
              ></div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@lba.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 placeholder-gray-400"
                  />
                  {emailError && (
                    <p className="mt-2 text-sm text-red-600 font-medium">
                      {emailError}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 placeholder-gray-400"
                  />
                  {passwordError && (
                    <p className="mt-2 text-sm text-red-600 font-medium">
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-600 group-hover:text-gray-900">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                onClick={() => handleSubmit()}
                className={`w-full ${THEME.INFO.GRADIENT} ${THEME.INFO.GRADIENT_HOVER} text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group`}
              >
                Sign In to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-br from-white to-gray-50 text-gray-500">
                    Secure Admin Access
                  </span>
                </div>
              </div>

              {/* Footer Info */}
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Protected by enterprise-level security
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Lock className="w-3 h-3" />
                  <span>Encrypted connection</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>Admin only</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            © 2025 League Basketball Association. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
