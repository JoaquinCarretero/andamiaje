"use client"

import { useState } from "react"
import { DashboardLayout } from "@/features/dashboard"
import { FamilyTracking, CompanionTracking } from "@/features/tracking"
import { UserRole } from "@/types/auth"
import { ProtectedRoute } from "@/features/auth"
import { useAppSelector } from "@/store"

export default function CoordinadorPage() {
  const [currentView, setCurrentView] = useState("dashboard")
  const { user } = useAppSelector((state) => state.auth)

  const renderContent = () => {
    switch (currentView) {
      case "seguimiento-familias":
        return <FamilyTracking />
      case "seguimiento-acompanantes":
        return <CompanionTracking />
      case "seguimiento-flia":
        return <FamilyTracking />
      default:
        return null
    }
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.COORDINADOR, UserRole.COORDINADOR_UNO]}>
      <DashboardLayout
        userData={user}
        currentView={currentView}
        onNavigate={setCurrentView}
        role="coordinador"
      >
        {renderContent()}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
