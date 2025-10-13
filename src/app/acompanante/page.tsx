"use client"

import { useState } from "react"
import { DashboardLayout } from "@/features/dashboard"
import { WorkPlanForm, MonthlyReportForm } from "@/features/reports"
import { InvoiceUpload } from "@/features/documents"
import { UserRole } from "@/types/auth"
import { ProtectedRoute } from "@/features/auth"
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
