"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/therapist/dashboard-header"
import { DashboardStats } from "@/components/therapist/dashboard-stats"
import { QuickActions } from "@/components/therapist/quick-actions"
import { WorkPlanForm } from "@/components/therapist/work-plan-form"
import { SemesterReportForm } from "@/components/therapist/semester-report-form"
import { MeetingMinutesForm } from "@/components/therapist/meeting-minutes-form"
import { InvoiceUpload } from "@/components/therapist/invoice-upload"
import { TherapistSidebar } from "@/components/therapist/therapist-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const userData = {
  name: "Dr. María González",
  role: "Terapeuta",
  gender: "female", // for greeting logic
}

export default function TerapeutaPage() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <DashboardStats />
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              <div className="xl:col-span-3">
                <Card className="h-full">
                  <CardContent className="p-6 lg:p-8">
                    <h3 className="font-serif text-2xl lg:text-3xl font-semibold mb-4">
                      Bienvenid{userData.gender === "female" ? "a" : "o"}, {userData.name}
                    </h3>
                    <p className="text-muted-foreground mb-8 text-base lg:text-lg leading-relaxed">
                      Aquí tienes un resumen de tus actividades pendientes y el progreso de tus pacientes.
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { id: "plan-trabajo", title: "Plan de Trabajo", icon: "📋" },
                        { id: "informe-semestral", title: "Informe Semestral", icon: "📊" },
                        { id: "actas", title: "Actas", icon: "👥" },
                        { id: "facturas", title: "Facturas", icon: "📄" },
                      ].map((section) => (
                        <Button
                          key={section.id}
                          variant="outline"
                          className="h-28 lg:h-32 flex-col gap-3 bg-card hover:bg-accent/50 border-2 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                          onClick={() => setActiveSection(section.id)}
                        >
                          <div className="text-2xl lg:text-3xl bg-primary/10 p-3 lg:p-4 rounded-2xl border-4 border-primary/30">
                            {section.icon}
                          </div>
                          <span className="text-sm lg:text-base font-medium text-center leading-tight px-2">
                            {section.title}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="xl:col-span-2">
                <QuickActions onNavigate={setActiveSection} />
              </div>
            </div>
          </div>
        )
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
    <div className="min-h-screen bg-background flex w-full">
      <TherapistSidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          userData={userData}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        <main className="flex-1 p-4 md:p-8 lg:p-12">
          <div className="max-w-[1600px] mx-auto">
            {activeSection !== "dashboard" && (
              <div className="mb-8">
                <Button variant="ghost" onClick={() => setActiveSection("dashboard")} className="mb-6 hover:bg-accent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Dashboard
                </Button>
                <h1 className="font-serif text-4xl font-bold text-foreground">
                  {activeSection === "plan-trabajo" && "Plan de Trabajo"}
                  {activeSection === "informe-semestral" && "Informe Semestral"}
                  {activeSection === "actas" && "Actas"}
                  {activeSection === "facturas" && "Facturas"}
                </h1>
              </div>
            )}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
