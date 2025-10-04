"use client"

import { DirectorDashboard } from "@/components/director/director-dashboard"
import { UserRole } from "@/types/auth"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAppSelector } from "@/store"

export default function DirectorPage() {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <ProtectedRoute allowedRoles={[UserRole.DIRECTOR]}>
      <DirectorDashboard userData={user} />
    </ProtectedRoute>
  )
}
