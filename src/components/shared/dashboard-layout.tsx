"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/shared/navbar"
import { CalendarWidget } from "@/components/shared/calendar-widget"
import { WelcomeSignatureModal } from "@/components/ui/welcome-signature-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import colors from "@/lib/colors"
import { AuthService } from "@/lib/auth"
import { apiClient } from "@/lib/api"
import type { User } from "@/types/auth"

interface DashboardLayoutProps {
  userData?: User | null
  children?: React.ReactNode
  currentView: string
  onNavigate: (view: string) => void
  role: "terapeuta" | "acompanante" | "coordinador"
}

export function DashboardLayout({ userData, children, currentView, onNavigate, role }: DashboardLayoutProps) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(userData || null)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  useEffect(() => {
    if (!userData) {
      const user = AuthService.getUser()
      setCurrentUser(user)
      
      // Verificar si necesita mostrar el modal de bienvenida
      if (user && user.firstLogin && !user.hasSignature) {
        setShowWelcomeModal(true)
      }
    } else {
      setCurrentUser(userData)
      
      // Verificar si necesita mostrar el modal de bienvenida
      if (userData.firstLogin && !userData.hasSignature) {
        setShowWelcomeModal(true)
      }
    }
  }, [userData])

  const handleNavigation = (view: string) => {
    if (view === 'perfil') {
      router.push('/perfil')
    } else {
      onNavigate(view)
    }
  }

  if (!currentUser) {
    return null
  }

  const fullName = AuthService.getFullName(currentUser)
  const greeting = AuthService.getGreeting(currentUser)

  const handleSignatureComplete = async (signature: string, name: string) => {
    try {
      // Guardar firma en localStorage
      localStorage.setItem(
        "userSignature",
        JSON.stringify({
          signature,
          name,
          timestamp: new Date().toISOString(),
        })
      )

      // Actualizar el usuario para marcar que ya tiene firma y no es primer login
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          firstLogin: false,
          hasSignature: true
        }
        setCurrentUser(updatedUser)
        localStorage.setItem('authUser', JSON.stringify(updatedUser))
      }

      setShowWelcomeModal(false)
    } catch (error) {
      console.error('Error al guardar la firma:', error)
      throw error
    }
  }

  const getGreeting = () => {
    return greeting
  }

  const getActionButtons = () => {
    if (role === "terapeuta") {
      return [
        { id: "plan-trabajo", title: "Plan de Trabajo", icon: "📋", description: "Crear y gestionar planes" },
        { id: "informe-inicial", title: "Informe Inicial", icon: "📝", description: "Evaluación inicial del paciente" },
        { id: "informe-semestral", title: "Informe Semestral", icon: "📊", description: "Reportes de progreso" },
        { id: "actas", title: "Actas de Reunión", icon: "👥", description: "Registrar reuniones" },
        { id: "facturas", title: "Gestión de Facturas", icon: "📄", description: "Subir documentos" },
      ]
    } else if (role === "coordinador") {
      return [
        { id: "informe-inicial", title: "Informe Inicial", icon: "📝", description: "Evaluación inicial del paciente" },
        { id: "informe-semestral", title: "Informe Semestral", icon: "📊", description: "Reportes de progreso" },
        { id: "plan-trabajo", title: "Plan de Trabajo", icon: "📋", description: "Crear y gestionar planes" },
        { id: "seguimiento-acompanantes", title: "Seguimiento de Acompañantes Externos", icon: "👥", description: "Supervisar documentos de acompañantes" },
        { id: "actas", title: "Actas de Reunión", icon: "👥", description: "Registrar reuniones" },
        { id: "facturas", title: "Gestión de Facturas", icon: "📄", description: "Subir documentos" },
        { id: "reporte-mensual", title: "Reporte Mensual", icon: "📊", description: "Informes mensuales" },
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
      {/* Modal de Bienvenida con Firma */}
      <WelcomeSignatureModal
        isOpen={showWelcomeModal}
        onComplete={handleSignatureComplete}
        userName={fullName}
        userRole={AuthService.getRoleTitle(currentUser?.role)}
      />
      
      {/* Solo mostrar navbar si no hay modal de bienvenida */}
      {!showWelcomeModal && (
        <Navbar userData={currentUser} onNavigate={onNavigate} />
      )}
      
      {/* Solo mostrar contenido si no hay modal de bienvenida */}
      {!showWelcomeModal && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {currentView === "dashboard" ? (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <Card 
                  className="shadow-soft border-0 h-fit" 
                  style={{ 
                    backgroundColor: colors.surface,
                    background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.neutral[50]} 100%)`
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Sparkles className="h-6 w-6" style={{ color: colors.primary[500] }} />
                      <h2 className="font-display text-xl lg:text-2xl font-bold" style={{ color: colors.text }}>
                        {getGreeting()} {fullName.split(' ')[0]}
                      </h2>
                    </div>
                    
                    <p className="text-sm lg:text-base mb-4 leading-relaxed" style={{ color: colors.textSecondary }}>
                      Bienvenido a tu espacio de trabajo. Aquí puedes gestionar todas tus actividades y 
                      hacer seguimiento del progreso de tus {role === "terapeuta" ? "pacientes" : "estudiantes"}.
                    </p>

                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                      {getActionButtons().map((section) => (
                        <button
                          key={section.id}
                          className={`group p-2.5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-medium text-left ${
                            section.id === "seguimiento-acompanantes" ? "ring-2 ring-offset-2" : ""
                          }`}
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: section.id === "seguimiento-acompanantes" ? colors.secondary[300] : colors.border,
                            boxShadow: section.id === "seguimiento-acompanantes" ? `0 8px 25px ${colors.secondary[500]}20` : undefined,
                          }}
                          onClick={() => handleNavigation(section.id)}
                        >
                          <div className="space-y-2">
                            <div
                              className={`text-lg p-1.5 rounded-xl border-2 w-fit transition-all duration-300 group-hover:scale-110 ${
                                section.id === "seguimiento-acompanantes" ? "animate-pulse-soft" : ""
                              }`}
                              style={{
                                backgroundColor: section.id === "seguimiento-acompanantes" ? colors.secondary[50] : colors.primary[50],
                                borderColor: section.id === "seguimiento-acompanantes" ? colors.secondary[200] : colors.primary[100],
                              }}
                            >
                              {section.icon}
                            </div>
                            <div>
                              <h3 
                                className={`font-medium text-xs mb-0.5 ${
                                  section.id === "seguimiento-acompanantes" ? "font-semibold" : ""
                                }`} 
                                style={{ 
                                  color: section.id === "seguimiento-acompanantes" ? colors.secondary[700] : colors.text 
                                }}
                              >
                                {section.title}
                              </h3>
                              <p className="text-xs leading-tight line-clamp-1 hidden lg:block" style={{ color: colors.textMuted }}>
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
                <CalendarWidget role={role} onNavigate={handleNavigation} />
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
                Volver al Inicio
              </Button>
              
              <h1 className="font-display text-3xl lg:text-4xl font-bold" style={{ color: colors.text }}>
                {currentView === "plan-trabajo" && "Plan de Trabajo"}
                {currentView === "informe-inicial" && "Informe Inicial"}
                {currentView === "informe-semestral" && "Informe Semestral"}
                {currentView === "reporte-mensual" && "Reporte Mensual"}
                {currentView === "seguimiento-acompanantes" && "Seguimiento de Acompañantes"}
                {currentView === "seguimiento-flia" && "Seguimiento de Familias"}
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
      )}
    </div>
  )
}