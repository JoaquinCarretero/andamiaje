"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { WorkPlanForm } from "@/components/therapist/work-plan-form"
import SemesterReportForm from "@/components/therapist/semester-report-form"
import { MeetingMinutesForm } from "@/components/therapist/meeting-minutes-form"
import { InitialReportForm } from "@/components/therapist/initial-report-form"
import { InvoiceUpload } from "@/components/therapist/invoice-upload"
import { UserRole } from "@/types/auth"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAppSelector } from "@/store"

export default function TerapeutaPage() {
  const [currentView, setCurrentView] = useState("dashboard")
  const { user } = useAppSelector((state) => state.auth)

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
      default:
        return null
    }
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.TERAPEUTA]}>
      <DashboardLayout
        userData={user}
        currentView={currentView}
        onNavigate={setCurrentView}
        role="terapeuta"
      >
        {renderContent()}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
