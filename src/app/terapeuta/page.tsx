"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { WorkPlanForm } from "@/components/therapist/work-plan-form"
import { SemesterReportForm } from "@/components/therapist/semester-report-form"
import { MeetingMinutesForm } from "@/components/therapist/meeting-minutes-form"
import { InvoiceUpload } from "@/components/therapist/invoice-upload"

const userData = {
  name: "Dr. María González",
  title: "Terapeuta Ocupacional",
  role: "terapeuta" as const,
  gender: "female",
}

export default function TerapeutaPage() {
  const [currentView, setCurrentView] = useState("dashboard")

  const renderContent = () => {
    switch (currentView) {
      case "plan-trabajo":
        return <WorkPlanForm />
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
    <DashboardLayout
      userData={userData}
      currentView={currentView}
      onNavigate={setCurrentView}
    >
      {renderContent()}
    </DashboardLayout>
  )
}