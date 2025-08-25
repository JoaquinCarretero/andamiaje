"use client"

import { useState } from "react"
import { Bell, User, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import colors from "@/lib/colors"

interface NavbarProps {
  userData: {
    name: string
    title: string
    role: string
  }
}

export function Navbar({ userData }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav
      className="border-b sticky top-0 z-50 shadow-md"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-64 h-64 relative">
                <Image
                  src="/LogotipoFinalWEBJPEG.png"
                  alt="Andamiaje Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-emerald-100 transition-colors rounded-full"
              style={{ color: colors.text }}
            >
              <Bell className="h-5 w-5" />
              <Badge
                style={{ backgroundColor: colors.accent, color: "#fff" }}
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            {/* User info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium" style={{ color: colors.text }}>
                  {userData.name}
                </p>
                <p className="text-xs" style={{ color: colors.secondary }}>
                  {userData.title}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-emerald-100 transition-colors rounded-full"
                style={{ color: colors.text }}
              >
                <User className="h-5 w-5" />
              </Button>
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-emerald-100 transition-colors rounded-full"
              style={{ color: colors.text }}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ color: colors.text }}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden border-t py-4"
            style={{ borderColor: colors.border }}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 px-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-emerald-100 transition-colors rounded-full"
                  style={{ color: colors.text }}
                >
                  <User className="h-5 w-5" />
                </Button>
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.text }}>
                    {userData.name}
                  </p>
                  <p className="text-xs" style={{ color: colors.secondary }}>
                    {userData.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-emerald-100 transition-colors rounded-lg"
                  style={{ color: colors.text }}
                >
                  <Bell className="h-5 w-5" />
                  <span>Notificaciones</span>
                  <Badge
                    style={{ backgroundColor: colors.accent, color: "#fff" }}
                    className="ml-2"
                  >
                    3
                  </Badge>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-[#00baa7] transition-colors rounded-full"
                  style={{ color: colors.text }}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
