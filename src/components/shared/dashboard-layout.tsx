"use client"

import { useState } from "react"
import { Navbar } from "@/components/shared/navbar"
import { DashboardStats } from "@/components/shared/dashboard-stats"
import { QuickActions } from "@/components/shared/quick-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import colors from "@/lib/colors"

interface DashboardLayoutProps {
  userData: {
    name: string
    title: string
    role: "terapeuta" | "acompanante"
    gender?: string
  }
  children?: React.ReactNode
  currentView: string
  onNavigate: (view: string) => void
}

export function DashboardLayout({ userData, children, currentView, onNavigate }: DashboardLayoutProps) {
  const getGreeting = () => {
    if (userData.role === "terapeuta") {
      return userData.gender === "female" ? "Bienvenida" : "Bienvenido"
    }
    return "Bienvenido/a"
  }

  const getActionButtons = () => {
    if (userData.role === "terapeuta") {
      return [
        { id: "plan-trabajo", title: "Plan de Trabajo", icon: "📋" },
        { id: "informe-semestral", title: "Informe Semestral", icon: "📊" },
        { id: "actas", title: "Actas", icon: "👥" },
        { id: "facturas", title: "Facturas", icon: "📄" },
      ]
    } else {
      return [
        { id: "plan-trabajo", title: "Plan de Trabajo", icon: "📋" },
        { id: "reporte-mensual", title: "Reporte Mensual", icon: "📊" },
        { id: "facturas", title: "Facturas", icon: "📄" },
      ]
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <Navbar userData={userData} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {currentView === "dashboard" ? (
          <div className="space-y-8">
            {/* Stats */}
            <DashboardStats role={userData.role} />

            {/* Welcome Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <Card className="h-full" style={{ backgroundColor: colors.surface }}>
                  <CardContent className="p-6 lg:p-8">
                    <h2 className="font-serif text-2xl lg:text-2xl font-bold mb-4" style={{ color: colors.text }}>
                      {getGreeting()}, {userData.name}
                    </h2>
                    <p className="mb-8 leading-relaxed" style={{ color: colors.textMuted }}>
                      Aquí tienes un resumen de tus actividades pendientes y el progreso de tus {userData.role === "terapeuta" ? "pacientes" : "estudiantes"}.
                    </p>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                      {getActionButtons().map((section) => (
                        <Button
                          key={section.id}
                          variant="outline"
                          className="h-24 lg:h-32 flex-col gap-3 border-2 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.primary,
                            color: colors.text
                          }}
                          onClick={() => onNavigate(section.id)}
                        >
                          <div
                            className="text-2xl lg:text-3xl p-3 lg:p-4 rounded-2xl border-4"
                            style={{
                              backgroundColor: `${colors.primary}33`, // transparente
                              borderColor: `${colors.primary}30`,
                            }}
                          >
                            {section.icon}
                          </div>
                          <span className="text-xs lg:text-sm font-medium text-center leading-tight px-2">
                            {section.title}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="xl:col-span-1">
                <QuickActions role={userData.role} onNavigate={onNavigate} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back button and title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Button 
                variant="ghost" 
                onClick={() => onNavigate("dashboard")} 
                style={{ color: colors.text }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
              
              <h1 className="font-serif text-2xl lg:text-4xl font-bold" style={{ color: colors.text }}>
                {currentView === "plan-trabajo" && "Plan de Trabajo"}
                {currentView === "informe-semestral" && "Informe Semestral"}
                {currentView === "reporte-mensual" && "Reporte Mensual"}
                {currentView === "actas" && "Actas"}
                {currentView === "facturas" && "Facturas"}
              </h1>
            </div>

            {/* Content */}
            {children}
          </div>
        )}
      </main>
    </div>
  )
}
