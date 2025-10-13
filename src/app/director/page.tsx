"use client"

import { DirectorDashboard } from "@/features/dashboard"
import { UserRole } from "@/types/auth"
import { ProtectedRoute } from "@/features/auth"
import { useAppSelector } from "@/store"

export default function DirectorPage() {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <ProtectedRoute allowedRoles={[UserRole.DIRECTOR]}>
      <DirectorDashboard userData={user} />
    </ProtectedRoute>
  )
}
