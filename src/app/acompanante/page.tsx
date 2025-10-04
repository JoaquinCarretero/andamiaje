"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { WorkPlanForm } from "@/components/therapist/work-plan-form"
import { MonthlyReportForm } from "@/components/acompanante/monthly-report-form"
import { InvoiceUpload } from "@/components/therapist/invoice-upload"
import { UserRole } from "@/types/auth"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAppSelector } from "@/store"

export default function AcompanantePage() {
  const [currentView, setCurrentView] = useState("dashboard")
  const { user } = useAppSelector((state) => state.auth)

  const renderContent = () => {
    switch (currentView) {
      case "plan-trabajo":
        return <WorkPlanForm />
      case "reporte-mensual":
        return <MonthlyReportForm />
      case "facturas":
        return <InvoiceUpload />
      default:
        return null
    }
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.ACOMPANANTE]}>
      <DashboardLayout
        userData={user}
        currentView={currentView}
        onNavigate={setCurrentView}
        role="acompanante"
      >
        {renderContent()}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
