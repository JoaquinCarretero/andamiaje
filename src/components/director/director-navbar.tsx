"use client"

import { useState } from "react"
import { Bell, User, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import colors from "@/lib/colors"

interface DirectorNavbarProps {
  userData: {
    name: string
    title: string
    role: string
  }
}

export function DirectorNavbar({ userData }: DirectorNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-44 h-36 relative overflow-hidden">
                <Image
                  src="/LogotipoFinalWEBJPEG.png"
                  alt="Andamiaje Logo"
                  fill
                  className="object-contain scale-150"
                />
              </div>
            </div>

            {/* Desktop user menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full transition-all duration-200 hover:bg-neutral-100"
                style={{ color: colors.textSecondary }}
              >
                <Bell className="h-5 w-5" />
                <Badge
                  style={{ backgroundColor: colors.accent[500], color: colors.surface }}
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-medium"
                >
                  5
                </Badge>
              </Button>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium" style={{ color: colors.text }}>
                    {userData.name}
                  </p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>
                    {userData.title}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full transition-all duration-200"
                  style={{ 
                    color: colors.textSecondary,
                    backgroundColor: colors.neutral[100]
                  }}
                >
                  <User className="h-5 w-5" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                style={{ color: colors.textSecondary }}
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
              <div 
                className="flex items-center justify-between p-6 border-b flex-shrink-0"
                style={{ borderColor: colors.border }}
              >
                <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
                  Menú Director
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
                      {userData.name}
                    </p>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      {userData.title}
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className="p-6 border-t flex-shrink-0"
                style={{ borderColor: colors.border }}
              >
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 rounded-lg"
                    style={{ color: colors.textSecondary }}
                  >
                    <Bell className="h-5 w-5" />
                    <span>Notificaciones</span>
                    <Badge
                      style={{ backgroundColor: colors.accent[500], color: colors.surface }}
                      className="ml-2 text-xs"
                    >
                      5
                    </Badge>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-red-50 hover:text-red-600"
                    style={{ color: colors.textSecondary }}
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