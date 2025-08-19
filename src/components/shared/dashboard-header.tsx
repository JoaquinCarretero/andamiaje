"use client"

import { Bell, User, LogOut, Menu } from "lucide-react"

interface DashboardHeaderProps {
  role: "terapeuta" | "acompanante"
  userName: string
  userTitle: string
  isMobileMenuOpen: boolean
  onMobileMenuToggle: () => void
}

const roleConfig = {
  terapeuta: {
    greeting: "Bienvenida",
    title: "Terapeuta",
  },
  acompanante: {
    greeting: "Bienvenido/a",
    title: "Acompañante Externo",
  },
}

export function DashboardHeader({
  role,
  userName,
  userTitle,
  isMobileMenuOpen,
  onMobileMenuToggle,
}: DashboardHeaderProps) {
  const config = roleConfig[role]

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <button onClick={onMobileMenuToggle} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
          {isMobileMenuOpen ? <Menu className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
        </button>

        {/* Mobile Logo */}
        <div className="md:hidden flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Andamiaje</h1>
            <p className="text-xs text-gray-500">Centro de Rehabilitación</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{config.title}</p>
          </div>
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Logout */}
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <LogOut className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>
  )
}
