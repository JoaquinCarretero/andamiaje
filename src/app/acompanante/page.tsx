"use client"

import { useState } from "react"
import { Sidebar } from "@/components/shared/sidebar"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { DashboardStats } from "@/components/shared/dashboard-stats"
import { QuickActions } from "@/components/shared/quick-actions"

export default function AcompanantePage() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const userData = {
    name: "Prof. Ana Martínez",
    title: "Acompañante Externo",
    role: "acompanante" as const,
  }

  const handleNavigate = (view: string) => {
    setCurrentView(view)
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        role="acompanante"
        currentView={currentView}
        onNavigate={handleNavigate}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuClose={handleMobileMenuClose}
      />

      {/* Main Content */}
      <div className="md:ml-64 transition-all duration-300">
        {/* Header */}
        <DashboardHeader
          role="acompanante"
          userName={userData.name}
          userTitle={userData.title}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={handleMobileMenuToggle}
        />

        {/* Dashboard Content */}
        <main className="p-6">
          {currentView === "dashboard" && (
            <>
              {/* Stats */}
              <DashboardStats role="acompanante" />

              {/* Welcome Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido/a, {userData.name}</h2>
                  <p className="text-gray-600 mb-6">
                    Aquí tienes un resumen de tus actividades pendientes y el progreso de tus estudiantes.
                  </p>

                  {/* Action Icons */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleNavigate("plan-trabajo")}
                      className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
                    >
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
                        📋
                      </div>
                      <span className="text-sm font-medium text-gray-900">Plan de Trabajo</span>
                    </button>

                    <button
                      onClick={() => handleNavigate("reporte-mensual")}
                      className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
                    >
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                        📊
                      </div>
                      <span className="text-sm font-medium text-gray-900">Reporte Mensual</span>
                    </button>

                    <button
                      onClick={() => handleNavigate("facturas")}
                      className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                        📄
                      </div>
                      <span className="text-sm font-medium text-gray-900">Facturas</span>
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <QuickActions role="acompanante" onNavigate={handleNavigate} />
                </div>
              </div>
            </>
          )}

          {/* Other Views Placeholder */}
          {currentView !== "dashboard" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentView === "plan-trabajo" && "Plan de Trabajo"}
                {currentView === "reporte-mensual" && "Reporte Mensual"}
                {currentView === "facturas" && "Facturas ARCA"}
              </h2>
              <p className="text-gray-600 mb-6">
                Esta sección estará disponible próximamente con formularios específicos para {userData.role}.
              </p>
              <button
                onClick={() => handleNavigate("dashboard")}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Volver al Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
