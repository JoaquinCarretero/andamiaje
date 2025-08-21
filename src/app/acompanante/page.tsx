"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { WorkPlanForm } from "@/components/therapist/work-plan-form"
import { MonthlyReportForm } from "@/components/acompanante/monthly-report-form"
import { InvoiceUpload } from "@/components/therapist/invoice-upload"

const userData = {
  name: "Prof. Ana Martínez",
  title: "Acompañante Externo",
  role: "acompanante" as const,
}

export default function AcompanantePage() {
  const [currentView, setCurrentView] = useState("dashboard")

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
    <DashboardLayout
      userData={userData}
      currentView={currentView}
      onNavigate={setCurrentView}
    >
      {renderContent()}
    </DashboardLayout>
  )
}