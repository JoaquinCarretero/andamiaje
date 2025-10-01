"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, LogOut, Menu, X, Chrome as Home, FileText, Calendar, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import colors from "@/lib/colors"
import { AuthService } from "@/lib/auth"
import { User as UserType, UserRole } from "@/types/auth"

interface NavbarProps {
  userData?: UserType | null
  onNavigate?: (view: string) => void
}

export function Navbar({ userData, onNavigate }: NavbarProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserType | null>(userData || null)

  useEffect(() => {
    // Solo actualizar si userData cambia o si no tenemos usuario actual
    if (userData) {
      setCurrentUser(userData)
    } else if (!currentUser) {
      const user = AuthService.getUser()
      setCurrentUser(user)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  const handleProfileClick = () => {
    router.push('/perfil')
  }

  const handleLogout = () => {
    // Limpiar todo el localStorage relacionado con la sesión
    AuthService.logout()
    // Forzar recarga para limpiar cualquier estado residual
    window.location.href = '/login'
  }

  if (!currentUser) {
    return null
  }

  const fullName = AuthService.getFullName(currentUser)
  const roleTitle = AuthService.getRoleTitle(currentUser.role)

  const getQuickActions = () => {
    if (currentUser.role === UserRole.TERAPEUTA) {
      return [
        { id: "plan-trabajo", title: "Plan de Trabajo", icon: FileText },
        { id: "informe-inicial", title: "Informe Inicial", icon: User },
        { id: "informe-semestral", title: "Informe Semestral", icon: Calendar },
        { id: "actas", title: "Actas", icon: User },
        { id: "facturas", title: "Facturas", icon: Upload },
      ]
    } else {
      return [
        { id: "plan-trabajo", title: "Plan de Trabajo", icon: FileText },
        { id: "reporte-mensual", title: "Reporte Mensual", icon: Calendar },
        { id: "facturas", title: "Facturas", icon: Upload },
      ]
    }
  }

  const handleMobileNavigation = (actionId: string) => {
    setIsMobileMenuOpen(false)
    if (onNavigate) {
      onNavigate(actionId)
    }
  }

  return (
    <>
      <nav
        className="border-b sticky top-0 z-50 backdrop-blur-sm"
        style={{ 
          backgroundColor: `${colors.surface}f0`, 
          borderColor: colors.border,
          boxShadow: `0 1px 3px ${colors.shadow}`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y nombre */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-44 h-36 relative overflow-hidden">
                  <Image
                    src="/LogotipoFinalWEBJPEG.png"
                    alt="Andamiaje Logo"
                    fill
                    className="object-contain scale-150"
                  />
                </div>
              </div>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              {/* User info */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium" style={{ color: colors.text }}>
                    {fullName || 'Usuario'}
                  </p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>
                    {roleTitle || 'Usuario'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleProfileClick}
                  className="rounded-full transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:scale-105"
                  style={{ 
                    color: colors.textSecondary,
                    backgroundColor: colors.neutral[100]
                  }}
                  title="Ver perfil"
                >
                  <User className="h-5 w-5" />
                </Button>
              </div>

              {/* Logout */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="rounded-full transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:scale-105"
                style={{ color: colors.textSecondary }}
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
                className="rounded-full"
                style={{ color: colors.text }}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div 
            className="fixed right-0 top-0 h-full w-80 max-w-[85vw] shadow-xl"
            style={{ backgroundColor: colors.surface }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div 
                className="flex items-center justify-between p-6 border-b flex-shrink-0"
                style={{ borderColor: colors.border }}
              >
                <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
                  Menú
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full"
                  style={{ color: colors.textSecondary }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* User info */}
              <div 
                className="p-6 border-b flex-shrink-0"
                style={{ borderColor: colors.border }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.primary[50] }}
                  >
                    <User className="h-6 w-6" style={{ color: colors.primary[500] }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: colors.text }}>
                      {fullName || 'Usuario'}
                    </p>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      {roleTitle || 'Usuario'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Scrollable */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="p-6">
                  <h3 className="text-sm font-medium mb-4" style={{ color: colors.textSecondary }}>
                    Acciones Rápidas
                  </h3>
                  <div className="space-y-2">
                    {getQuickActions().map((action) => {
                      const Icon = action.icon
                      return (
                        <button
                          key={action.id}
                          onClick={() => handleMobileNavigation(action.id)}
                          className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:scale-105 hover:bg-neutral-100"
                          style={{ 
                            backgroundColor: colors.neutral[50]
                          }}
                        >
                          <Icon className="h-5 w-5" style={{ color: colors.primary[500] }} />
                          <span className="text-sm font-medium" style={{ color: colors.text }}>
                            {action.title}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Dashboard link */}
                  <div className="mt-6 pt-6 border-t" style={{ borderColor: colors.border }}>
                    <button
                      onClick={() => handleMobileNavigation("dashboard")}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:scale-105 hover:bg-neutral-100"
                      style={{ 
                        backgroundColor: colors.neutral[50]
                      }}
                    >
                      <Home className="h-5 w-5" style={{ color: colors.primary[500] }} />
                      <span className="text-sm font-medium" style={{ color: colors.text }}>
                        Dashboard
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div 
                className="p-6 border-t flex-shrink-0"
                style={{ borderColor: colors.border }}
              >
                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="rounded-full hover:bg-red-50 hover:text-red-600"
                    style={{ color: colors.textSecondary }}
                    title="Cerrar sesión"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  )
}