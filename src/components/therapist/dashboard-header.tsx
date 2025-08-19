"use client"

import { Bell, User, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  userData: {
    name: string
    role: string
    gender: string
  }
  onMobileMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export function DashboardHeader({ userData, onMobileMenuToggle, isMobileMenuOpen = false }: DashboardHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-4 py-3 md:px-6 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={onMobileMenuToggle} className="hover:bg-accent">
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {!isMobileMenuOpen && (
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="font-serif text-lg font-semibold text-foreground">Andamiaje</h1>
                <p className="text-xs text-muted-foreground">Centro de Rehabilitación</p>
              </div>
            </div>
          )}
        </div>

        {!isMobileMenuOpen && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative hover:bg-accent">
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            <div className="flex items-center gap-2 ml-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{userData.name}</p>
                <p className="text-xs text-muted-foreground">{userData.role}</p>
              </div>
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
