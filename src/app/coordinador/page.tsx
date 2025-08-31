"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { WorkPlanForm } from "@/components/therapist/work-plan-form"
import SemesterReportForm from "@/components/therapist/semester-report-form"
import { MeetingMinutesForm } from "@/components/therapist/meeting-minutes-form"
import { InitialReportForm } from "@/components/therapist/initial-report-form"
import { InvoiceUpload } from "@/components/therapist/invoice-upload"
import { MonthlyReportForm } from "@/components/acompanante/monthly-report-form"
import { CompanionTracking } from "@/components/coordinator/companion-tracking"
import { FamilyTracking } from "@/components/coordinator/family-tracking"
import { Button } from "@/components/ui/button"
import { Users, ArrowLeft } from "lucide-react"
import colors from "@/lib/colors"

const userData = {
  name: "Lucre Martínez",
  title: "Coordinadora General",
  role: "coordinador" as const,
  gender: "female",
}

export default function CoordinadorPage() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [showCompanionTracking, setShowCompanionTracking] = useState(false)

  const renderContent = () => {
    if (showCompanionTracking) {
      return <CompanionTracking />
    }

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
      case "seguimiento-flia":
        return <FamilyTracking />
      default:
        return null
    }
  }

  const getPageTitle = () => {
    if (showCompanionTracking) return "Seguimiento de Acompañantes Externos"
    
    switch (currentView) {
      case "plan-trabajo": return "Plan de Trabajo"
      case "informe-inicial": return "Informe Inicial"
      case "informe-semestral": return "Informe Semestral"
      case "reporte-mensual": return "Reporte Mensual"
      case "seguimiento-flia": return "Seguimiento de Familias"
      case "actas": return "Actas de Reunión"
      case "facturas": return "Gestión de Facturas"
      default: return ""
    }
  }

  const handleNavigation = (view: string) => {
    if (view === "seguimiento-acompanantes") {
      setShowCompanionTracking(true)
      setCurrentView("dashboard")
    } else {
      setShowCompanionTracking(false)
      setCurrentView(view)
    }
  }

  const handleBackToDashboard = () => {
    setShowCompanionTracking(false)
    setCurrentView("dashboard")
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Special Companion Tracking Tab */}
      {currentView === "dashboard" && !showCompanionTracking && (
        <div 
          className="border-b sticky top-16 z-40 backdrop-blur-sm"
          style={{ 
            backgroundColor: `${colors.surface}f0`, 
            borderColor: colors.border 
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <Button
                onClick={() => setShowCompanionTracking(true)}
                className="flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-medium"
                style={{
                  backgroundColor: colors.secondary[500],
                  color: colors.surface,
                }}
              >
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Seguimiento de Acompañantes Externos</div>
                  <div className="text-xs opacity-90">Gestionar reportes y documentos</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}

      <DashboardLayout
        userData={userData}
        currentView={currentView}
        onNavigate={handleNavigation}
      >
        {(currentView !== "dashboard" || showCompanionTracking) && (
          <div className="space-y-6">
            {/* Back button and title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Button 
                variant="ghost" 
                onClick={handleBackToDashboard}
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
                {getPageTitle()}
              </h1>
            </div>

            {/* Content */}
            <div className="animate-slide-in-up">
              {renderContent()}
            </div>
          </div>
        )}
      </DashboardLayout>
    </div>
  )
}