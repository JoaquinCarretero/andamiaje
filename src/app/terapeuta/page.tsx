"use client"

import { useState, Suspense } from "react"
import dynamic from "next/dynamic"
import { DashboardLayout } from "@/features/dashboard"
import { UserRole } from "@/types/auth"
import { ProtectedRoute } from "@/features/auth"
import { useAppSelector } from "@/store"

// ✅ Lazy loading de formularios pesados desde feature reports
const WorkPlanForm = dynamic(() => import("@/features/reports").then(mod => ({ default: mod.WorkPlanForm })), {
  loading: () => <FormSkeleton />,
  ssr: false,
})

const SemesterReportForm = dynamic(() => import("@/features/reports").then(mod => ({ default: mod.SemesterReportForm })), {
  loading: () => <FormSkeleton />,
  ssr: false,
})

const MeetingMinutesForm = dynamic(() => import("@/features/reports").then(mod => ({ default: mod.MeetingMinutesForm })), {
  loading: () => <FormSkeleton />,
  ssr: false,
})

const InitialReportForm = dynamic(() => import("@/features/reports").then(mod => ({ default: mod.InitialReportForm })), {
  loading: () => <FormSkeleton />,
  ssr: false,
})

const InvoiceUpload = dynamic(() => import("@/features/documents").then(mod => ({ default: mod.InvoiceUpload })), {
  loading: () => <FormSkeleton />,
  ssr: false,
})

// ✅ Componente de carga mientras se cargan los formularios
function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 bg-gray-200 rounded" />
      <div className="h-32 bg-gray-200 rounded" />
      <div className="h-12 bg-gray-200 rounded" />
      <div className="h-32 bg-gray-200 rounded" />
      <div className="h-12 bg-gray-200 rounded" />
    </div>
  )
}

export default function TerapeutaPage() {
  const [currentView, setCurrentView] = useState("dashboard")
  const { user } = useAppSelector((state) => state.auth)

  const renderContent = () => {
    switch (currentView) {
      case "plan-trabajo":
        return (
          <Suspense fallback={<FormSkeleton />}>
            <WorkPlanForm />
          </Suspense>
        )
      case "informe-inicial":
        return (
          <Suspense fallback={<FormSkeleton />}>
            <InitialReportForm />
          </Suspense>
        )
      case "informe-semestral":
        return (
          <Suspense fallback={<FormSkeleton />}>
            <SemesterReportForm />
          </Suspense>
        )
      case "actas":
        return (
          <Suspense fallback={<FormSkeleton />}>
            <MeetingMinutesForm />
          </Suspense>
        )
      case "facturas":
        return (
          <Suspense fallback={<FormSkeleton />}>
            <InvoiceUpload />
          </Suspense>
        )
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
