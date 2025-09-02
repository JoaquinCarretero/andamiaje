"use client"

import { useState } from "react"
import { DirectorNavbar } from "@/components/director/director-navbar"
import { DocumentsOverview } from "@/components/director/documents-overview"
import { StaffOverview } from "@/components/director/staff-overview"
import { SystemStats } from "@/components/director/system-stats"
import colors from "@/lib/colors"

interface DirectorDashboardProps {
  userData: {
    name: string
    title: string
    role: "director"
    gender?: string
  }
}

export function DirectorDashboard({ userData }: DirectorDashboardProps) {
  const [currentView, setCurrentView] = useState("overview")

  const renderContent = () => {
    switch (currentView) {
      case "documents":
        return <DocumentsOverview />
      default:
        return (
          <DocumentsOverview />
        )
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <DirectorNavbar userData={userData} currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="animate-slide-in-up">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}