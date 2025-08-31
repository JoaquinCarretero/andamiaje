"use client"

import { useState } from "react"
import { Navbar } from "@/components/shared/navbar"
import { DashboardStats } from "@/components/shared/dashboard-stats"
import { QuickActions } from "@/components/shared/quick-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
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
    const hour = new Date().getHours()
    let timeGreeting = "Buenos días"
    if (hour >= 12 && hour < 18) timeGreeting = "Buenas tardes"
    else if (hour >= 18) timeGreeting = "Buenas noches"
    
    if (userData.role === "terapeuta") {
      return userData.gender === "female" ? `${timeGreeting}, Dra.` : `${timeGreeting}, Dr.`
    }
    return `${timeGreeting}, Prof.`
  }

  const getActionButtons = () => {
    if (userData.role === "terapeuta") {
      return [
        { id: "plan-trabajo", title: "Plan de Trabajo", icon: "📋", description: "Crear y gestionar planes" },
        { id: "informe-semestral", title: "Informe Semestral", icon: "📊", description: "Reportes de progreso" },
        { id: "actas", title: "Actas de Reunión", icon: "👥", description: "Registrar reuniones" },
        { id: "facturas", title: "Gestión de Facturas", icon: "📄", description: "Subir documentos" },
      ]
    } else {
      return [
        { id: "plan-trabajo", title: "Plan de Trabajo", icon: "📋", description: "Crear y gestionar planes" },
        { id: "reporte-mensual", title: "Reporte Mensual", icon: "📊", description: "Informes mensuales" },
        { id: "facturas", title: "Gestión de Facturas", icon: "📄", description: "Subir documentos" },
      ]
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <Navbar userData={userData} onNavigate={onNavigate} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {currentView === "dashboard" ? (
          <div className="space-y-8">
            {/* Stats */}
            <DashboardStats role={userData.role} />

            {/* Welcome Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <Card 
                  className="h-full shadow-soft border-0" 
                  style={{ 
                    backgroundColor: colors.surface,
                    background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.neutral[50]} 100%)`
                  }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <Sparkles className="h-6 w-6" style={{ color: colors.primary[500] }} />
                      <h2 className="font-display text-3xl font-bold" style={{ color: colors.text }}>
                        {getGreeting()} {userData.name.split(' ')[0]}
                      </h2>
                    </div>
                    
                    <p className="text-lg mb-8 leading-relaxed" style={{ color: colors.textSecondary }}>
                      Bienvenido a tu espacio de trabajo. Aquí puedes gestionar todas tus actividades y 
                      hacer seguimiento del progreso de tus {userData.role === "terapeuta" ? "pacientes" : "estudiantes"}.
                    </p>

                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {getActionButtons().map((section) => (
                        <button
                          key={section.id}
                          className="group p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-medium text-left"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                          }}
                          onClick={() => onNavigate(section.id)}
                        >
                          <div className="space-y-3">
                            <div
                              className="text-3xl p-3 rounded-xl border-2 w-fit transition-all duration-300 group-hover:scale-110"
                              style={{
                                backgroundColor: colors.primary[50],
                                borderColor: colors.primary[100],
                              }}
                            >
                              {section.icon}
                            </div>
                            <div>
                              <h3 className="font-medium text-sm mb-1" style={{ color: colors.text }}>
                                {section.title}
                              </h3>
                              <p className="text-xs leading-tight" style={{ color: colors.textMuted }}>
                                {section.description}
                              </p>
                            </div>
                          </div>
                        </button>
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
                className="w-fit rounded-lg transition-all duration-200 hover:shadow-sm"
                style={{ 
                  color: colors.textSecondary,
                  backgroundColor: colors.neutral[50]
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
              
              <h1 className="font-display text-3xl lg:text-4xl font-bold" style={{ color: colors.text }}>
                {currentView === "plan-trabajo" && "Plan de Trabajo"}
                {currentView === "informe-semestral" && "Informe Semestral"}
                {currentView === "reporte-mensual" && "Reporte Mensual"}
                {currentView === "actas" && "Actas de Reunión"}
                {currentView === "facturas" && "Gestión de Facturas"}
              </h1>
            </div>

            {/* Content */}
            <div className="animate-slide-in-up">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}