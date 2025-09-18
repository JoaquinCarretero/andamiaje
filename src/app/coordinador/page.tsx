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
import { User, UserRole } from "@/types/auth"

export default function CoordinadorPage() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth for coordinador page...')
        const currentUser = await AuthService.getCurrentUser()
        console.log('Current user:', currentUser)
        if (!currentUser) {
          console.log('No user found, redirecting to login')
          router.push('/login')
          return
        }
        
        // Verificar que el usuario tenga el rol correcto
        console.log('User role:', currentUser.role, 'Expected:', UserRole.COORDINADOR)
        if (currentUser.role !== UserRole.COORDINADOR) {
          const correctRoute = AuthService.getRoleForRouting(currentUser.role)
          console.log('Wrong role, redirecting to:', correctRoute)
          router.push(`/${correctRoute}`)
          return
        }
        
        console.log('Auth check passed, setting user')
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