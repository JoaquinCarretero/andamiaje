"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Phone, Mail, MessageCircle, X } from "lucide-react"
import colors from "@/lib/colors"

interface UserProfilePopoverProps {
  isOpen: boolean
  onClose: () => void
  professional: {
    name: string
    role: string
    email: string
    phone: string
  } | null
  position: { x: number; y: number }
}

export function UserProfilePopover({ isOpen, onClose, professional, position }: UserProfilePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const openWhatsApp = () => {
    if (!professional) return
    const cleanPhone = professional.phone.replace(/\D/g, '')
    const message = encodeURIComponent(`Hola ${professional.name}, te contacto desde Andamiaje.`)
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank')
  }

  const openEmail = () => {
    if (!professional) return
    const subject = encodeURIComponent('Contacto desde Andamiaje')
    const body = encodeURIComponent(`Hola ${professional.name},\n\nTe contacto desde la plataforma Andamiaje.\n\nSaludos.`)
    window.open(`mailto:${professional.email}?subject=${subject}&body=${body}`, '_blank')
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Terapeuta":
        return { bg: colors.primary[50], text: colors.primary[600] }
      case "Coordinador":
        return { bg: colors.secondary[50], text: colors.secondary[600] }
      case "Acompañante":
        return { bg: colors.accent[50], text: colors.accent[600] }
      default:
        return { bg: colors.neutral[50], text: colors.neutral[600] }
    }
  }

  if (!isOpen || !professional) return null

  const roleColors = getRoleColor(professional.role)

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        ref={popoverRef}
        className="absolute pointer-events-auto"
        style={{
          left: `${position.x}px`,
          top: `${position.y - 10}px`,
          transform: 'translateX(-50%) translateY(-120%)',
        }}
      >
        <Card 
          className="w-80 shadow-xl border-0 animate-slide-in-up"
          style={{ 
            backgroundColor: colors.surface,
            boxShadow: `0 20px 40px ${colors.shadowLarge}`
          }}
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: roleColors.bg }}
                  >
                    <User className="h-6 w-6" style={{ color: roleColors.text }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
                      {professional.name}
                    </h3>
                    <span 
                      className="px-2 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: roleColors.bg,
                        color: roleColors.text
                      }}
                    >
                      {professional.role}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Información de contacto */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4" style={{ color: colors.textMuted }} />
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    {professional.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4" style={{ color: colors.textMuted }} />
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    {professional.phone}
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 pt-4 border-t" style={{ borderColor: colors.border }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openWhatsApp}
                  className="flex-1 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openEmail}
                  className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}