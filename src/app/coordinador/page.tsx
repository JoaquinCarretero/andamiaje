"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Calendar, FileText, TrendingUp, Heart } from "lucide-react"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { WorkPlanForm } from "@/components/therapist/work-plan-form"
import { InitialReportForm } from "@/components/therapist/initial-report-form"
import SemesterReportForm from "@/components/therapist/semester-report-form"
import { MeetingMinutesForm } from "@/components/therapist/meeting-minutes-form"
import { InvoiceUpload } from "@/components/therapist/invoice-upload"
import { MonthlyReportForm } from "@/components/acompanante/monthly-report-form"
import { CompanionTracking } from "@/components/coordinator/companion-tracking"
import { FamilyTracking } from "@/components/coordinator/family-tracking"
import colors from "@/lib/colors"

export default function CoordinadorPage() {
  const [selectedCoordinator, setSelectedCoordinator] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState("dashboard")

  const coordinators = [
    {
      id: "lucre",
      name: "Lucre Martínez",
      title: "Coordinadora General",
      role: "coordinador" as const,
      gender: "female",
      tasks: [
        "informe-semestral",
        "informe-inicial", 
        "plan-trabajo",
        "seguimiento-acompanantes",
        "actas",
        "facturas",
        "reporte-mensual"
      ],
      description: "Gestión integral y seguimiento de acompañantes externos",
      stats: {
        acompanantes: 8,
        reportes: 15,
        pendientes: 3
      }
    },
    {
      id: "juli",
      name: "Juli Rodríguez",
      title: "Coordinadora de Familias",
      role: "coordinador" as const,
      gender: "female",
      tasks: [
        "seguimiento-flia",
        "actas",
        "facturas",
        "informe-semestral"
      ],
      description: "Seguimiento y apoyo a familias",
      stats: {
        familias: 12,
        reuniones: 8,
        pendientes: 2
      }
    }
  ]

  const renderContent = () => {
    if (!selectedCoordinator) return null

    switch (currentView) {
      case "plan-trabajo":
        return <WorkPlanForm />
      case "informe-inicial":
        return <InitialReportForm />
      case "informe-semestral":
        return <SemesterReportForm />
      case "actas":
        return <MeetingMinutesForm />
      case "facturas":
        return <InvoiceUpload />
      case "reporte-mensual":
        return <MonthlyReportForm />
      case "seguimiento-acompanantes":
        return <CompanionTracking />
      case "seguimiento-flia":
        return <FamilyTracking />
      default:
        return null
    }
  }

  if (!selectedCoordinator) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold mb-4" style={{ color: colors.text }}>
              Panel de Coordinación
            </h1>
            <p className="text-lg" style={{ color: colors.textSecondary }}>
              Selecciona tu perfil de coordinador para acceder a tu espacio de trabajo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coordinators.map((coordinator) => (
              <Card
                key={coordinator.id}
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0"
                style={{ 
                  backgroundColor: colors.surface,
                  boxShadow: `0 8px 32px ${colors.shadow}`
                }}
                onClick={() => setSelectedCoordinator(coordinator.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: colors.primary[50] }}
                  >
                    <Users className="w-10 h-10" style={{ color: colors.primary[500] }} />
                  </div>
                  <CardTitle className="text-xl font-display" style={{ color: colors.text }}>
                    {coordinator.name}
                  </CardTitle>
                  <p className="text-sm" style={{ color: colors.textMuted }}>
                    {coordinator.title}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
                    {coordinator.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {coordinator.id === "lucre" ? (
                      <>
                        <div>
                          <p className="text-lg font-bold" style={{ color: colors.primary[500] }}>
                            {coordinator.stats.acompanantes}
                          </p>
                          <p className="text-xs" style={{ color: colors.textMuted }}>
                            Acompañantes
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold" style={{ color: colors.accent[500] }}>
                            {coordinator.stats.reportes}
                          </p>
                          <p className="text-xs" style={{ color: colors.textMuted }}>
                            Reportes
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold" style={{ color: colors.warning[500] }}>
                            {coordinator.stats.pendientes}
                          </p>
                          <p className="text-xs" style={{ color: colors.textMuted }}>
                            Pendientes
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-lg font-bold" style={{ color: colors.secondary[500] }}>
                            {coordinator.stats.familias}
                          </p>
                          <p className="text-xs" style={{ color: colors.textMuted }}>
                            Familias
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold" style={{ color: colors.accent[500] }}>
                            {coordinator.stats.reuniones}
                          </p>
                          <p className="text-xs" style={{ color: colors.textMuted }}>
                            Reuniones
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold" style={{ color: colors.warning[500] }}>
                            {coordinator.stats.pendientes}
                          </p>
                          <p className="text-xs" style={{ color: colors.textMuted }}>
                            Pendientes
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Tasks count */}
                  <div className="flex justify-center">
                    <Badge
                      variant="outline"
                      style={{
                        backgroundColor: colors.primary[50],
                        color: colors.primary[700],
                        borderColor: colors.primary[200]
                      }}
                    >
                      {coordinator.tasks.length} tareas disponibles
                    </Badge>
                  </div>

                  <Button
                    className="w-full mt-4 transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: colors.primary[500],
                      color: colors.surface
                    }}
                  >
                    Acceder al Dashboard
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Back to login */}
          <div className="text-center mt-8">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/login'}
              style={{ color: colors.textMuted }}
            >
              ← Volver al login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentCoordinator = coordinators.find(c => c.id === selectedCoordinator)!

  return (
    <DashboardLayout
      userData={currentCoordinator}
      currentView={currentView}
      onNavigate={setCurrentView}
    >
      {renderContent()}
    </DashboardLayout>
  )
}