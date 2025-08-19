"use client"

import type React from "react"

import { useState } from "react"
import { Home, FileText, Calendar, Users, Upload, ChevronRight, X } from "lucide-react"

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  active?: boolean
}

interface SidebarProps {
  role: "terapeuta" | "acompanante"
  currentView: string
  onNavigate: (view: string) => void
  isMobileMenuOpen: boolean
  onMobileMenuClose: () => void
}

const roleConfig = {
  terapeuta: {
    title: "Terapeuta",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "plan-trabajo", label: "Plan de Trabajo", icon: FileText },
      { id: "informe-semestral", label: "Informe Semestral", icon: Calendar },
      { id: "actas", label: "Actas", icon: Users },
      { id: "facturas", label: "Facturas", icon: Upload },
    ],
  },
  acompanante: {
    title: "Acompañante Externo",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "plan-trabajo", label: "Plan de Trabajo", icon: FileText },
      { id: "reporte-mensual", label: "Reporte Mensual", icon: Calendar },
      { id: "facturas", label: "Facturas", icon: Upload },
    ],
  },
}

export function Sidebar({ role, currentView, onNavigate, isMobileMenuOpen, onMobileMenuClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const config = roleConfig[role]

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="w-full">
          <div className="h-16 px-4 py-4 border-b border-gray-200 flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div className="transition-opacity duration-300">
                  <h1 className="font-semibold text-gray-900">Andamiaje</h1>
                  <p className="text-xs text-gray-500">Centro de Rehabilitación</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {config.items.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  {!isCollapsed && <span className="font-medium transition-opacity duration-300">{item.label}</span>}
                </button>
              )
            })}
          </nav>

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-1/2 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            <ChevronRight
              className={`w-3 h-3 text-gray-600 transition-transform ${isCollapsed ? "rotate-0" : "rotate-180"}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onMobileMenuClose} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
            {/* Mobile Header */}
            <div className="h-16 px-4 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">Andamiaje</h1>
                  <p className="text-xs text-gray-500">Centro de Rehabilitación</p>
                </div>
              </div>
              <button onClick={onMobileMenuClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4 space-y-2">
              {config.items.map((item) => {
                const Icon = item.icon
                const isActive = currentView === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id)
                      onMobileMenuClose()
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
