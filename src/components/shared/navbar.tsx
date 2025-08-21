"use client"

import { useState } from "react"
import { Bell, User, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 relative">
                <Image
                  src="/cervesia_logo-removebg-preview.png"
                  alt="Andamiaje Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-serif text-xl font-bold text-primary">
                  Andamiaje Centro de Rehabilitación
                </h1>
                <p className="text-xs text-muted-foreground">
                  Sistema de Gestión Terapéutica
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="font-serif text-lg font-bold text-primary">
                  Andamiaje
                </h1>
              </div>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            {/* User info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                <p className="text-xs text-gray-500">{userData.title}</p>
              </div>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>

            {/* Logout */}
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 px-2">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <div>
                  <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-500">{userData.title}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between px-2">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notificaciones</span>
                  <Badge variant="destructive" className="ml-2">3</Badge>
                </Button>
                
                <Button variant="ghost" size="icon">
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