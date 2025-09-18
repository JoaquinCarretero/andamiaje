"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { WorkPlanForm } from "@/components/therapist/work-plan-form"
import SemesterReportForm from "@/components/therapist/semester-report-form"
import { MeetingMinutesForm } from "@/components/therapist/meeting-minutes-form"
import { InitialReportForm } from "@/components/therapist/initial-report-form"
import { InvoiceUpload } from "@/components/therapist/invoice-upload"
import { MonthlyReportForm } from "@/components/acompanante/monthly-report-form"
import { CompanionTracking } from "@/components/coordinator/companion-tracking"
import { FamilyTracking } from "@/components/coordinator/family-tracking"
import { AuthService } from "@/lib/auth"
import type { User } from "@/types/auth"

export default function CoordinadorPage() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
        if (!currentUser) {
          router.push('/login')
          return
        }
        
        // Verificar que el usuario tenga el rol correcto
        if (currentUser.role !== 'COORDINADOR' && currentUser.role !== 'coordinador_uno' && currentUser.role !== 'coordinador_dos') {
          const correctRoute = AuthService.getRoleForRouting(currentUser.role)
          router.push(`/${correctRoute}`)
          return
        }
        
        setUser(currentUser)
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

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
      userData={user}
      currentView={currentView}
      onNavigate={setCurrentView}
      role="coordinador"
    >
      {renderContent()}
    </DashboardLayout>
  )
}