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
import { Users, ArrowLeft, UserCheck } from "lucide-react"
import colors from "@/lib/colors"

const userData = {
  name: "Lucre Martínez",
  title: "Coordinadora General",
  role: "coordinador" as const,
  gender: "female",
}

export default function CoordinadorPage() {
  const [currentView, setCurrentView] = useState("dashboard")

  const renderContent = () => {
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

  const getPageTitle = () => {
    switch (currentView) {
      case "plan-trabajo": return "Plan de Trabajo"
      case "informe-inicial": return "Informe Inicial"
      case "informe-semestral": return "Informe Semestral"
      case "reporte-mensual": return "Reporte Mensual"
      case "seguimiento-acompanantes": return "Seguimiento de Acompañantes Externos"
      case "seguimiento-flia": return "Seguimiento de Familias"
      case "actas": return "Actas de Reunión"
      case "facturas": return "Gestión de Facturas"
      default: return ""
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <DashboardLayout
        userData={userData}
        currentView={currentView}
        onNavigate={setCurrentView}
      >
        {currentView !== "dashboard" && (
          <div className="space-y-6">
            {/* Back button and title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentView("dashboard")}
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

        {/* Special Companion Tracking Button - Fixed position in navbar area */}
        {currentView === "dashboard" && (
          <div 
            className="fixed top-20 right-6 z-50"
          >
            <Button
              onClick={() => setCurrentView("seguimiento-acompanantes")}
              className="flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl"
              style={{
                backgroundColor: colors.secondary[500],
                color: colors.surface,
                boxShadow: `0 8px 25px ${colors.secondary[500]}40`
              }}
            >
              <UserCheck className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium text-sm">Seguimiento</div>
                <div className="text-xs opacity-90">Acompañantes Externos</div>
              </div>
            </Button>
          </div>
        )}
      </DashboardLayout>
    </div>
  )
}