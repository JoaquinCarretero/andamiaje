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

  return (
    <DashboardLayout
      userData={userData}
      currentView={currentView}
      onNavigate={setCurrentView}
    >
      {renderContent()}
    </DashboardLayout>
  )
}