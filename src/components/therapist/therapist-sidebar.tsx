"use client"

import { Home, FileText, Calendar, Users, Upload, ChevronLeft, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface TherapistSidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function TherapistSidebar({
  activeSection,
  onNavigate,
  isMobileOpen = false,
  onMobileClose,
}: TherapistSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const sections = [
    { id: "dashboard", title: "Dashboard", icon: Home },
    { id: "plan-trabajo", title: "Plan de Trabajo", icon: FileText },
    { id: "informe-semestral", title: "Informe Semestral", icon: Calendar },
    { id: "actas", title: "Actas", icon: Users },
    { id: "facturas", title: "Facturas", icon: Upload },
  ]

  return (
    <>
      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onMobileClose} />}

      <div
        className={`fixed left-0 top-0 h-full bg-background z-50 transition-all duration-300 ease-in-out md:border-r md:border-border ${
          isCollapsed ? "w-16" : "w-64"
        } ${isMobileOpen ? "translate-x-0 w-full" : "-translate-x-full"} md:translate-x-0 md:w-auto`}
      >
        {isMobileOpen && (
          <div className="border-b border-border px-4 py-4 h-16 flex items-center justify-between md:hidden">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-foreground">Andamiaje</h2>
                <p className="text-xs text-muted-foreground">Centro de Rehabilitación</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onMobileClose} className="hover:bg-accent">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="border-b border-border px-4 py-[15px] h-[64px] hidden md:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <div
              className={`min-w-0 transition-all duration-300 ease-in-out ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
            >
              <h2 className="font-serif text-lg font-semibold text-foreground whitespace-nowrap">Andamiaje</h2>
              <p className="text-xs text-muted-foreground whitespace-nowrap">Centro de Rehabilitación</p>
            </div>
          </div>
        </div>

        <div className="flex-1 py-6 relative md:py-4">
          <nav className="space-y-2 px-4 md:space-y-1 md:px-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  onNavigate(section.id)
                  onMobileClose?.()
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 hover:bg-accent hover:text-accent-foreground md:gap-3 md:px-3 md:py-2.5 md:rounded-lg ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title={isCollapsed ? section.title : undefined}
              >
                <div className="w-5 h-5 flex-shrink-0 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <section.icon className="h-4 w-4" />
                  </div>
                </div>
                <span
                  className={`transition-all duration-300 ease-in-out text-base md:text-sm ${
                    isCollapsed ? "md:opacity-0 md:w-0 md:overflow-hidden" : "opacity-100"
                  } truncate`}
                >
                  {section.title}
                </span>
              </button>
            ))}
          </nav>

          <div className="absolute top-1/2 -translate-y-1/2 -right-3 z-50 hidden md:block">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`w-6 h-6 p-0 bg-background border-2 border-border shadow-md hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out ${
                isCollapsed ? "rotate-180" : ""
              }`}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className={`hidden md:block transition-all duration-300 ease-in-out ${isCollapsed ? "w-16" : "w-64"}`} />
    </>
  )
}
