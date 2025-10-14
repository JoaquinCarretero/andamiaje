"use client"

import { useState } from "react"
import { X, CheckCircle, User } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import colors from "@/lib/colors"

interface ProfileCompletionBannerProps {
  completeness: number
  onComplete: () => void
}

export function ProfileCompletionBanner({ completeness, onComplete }: ProfileCompletionBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed || completeness >= 100) return null

  return (
    <Card 
      className="shadow-soft border-0 relative"
      style={{ 
        backgroundColor: colors.primary[50],
        borderLeft: `4px solid ${colors.primary[500]}`
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.primary[100] }}
            >
              <User className="h-5 w-5" style={{ color: colors.primary[600] }} />
            </div>
            <div>
              <p className="font-medium text-sm" style={{ color: colors.primary[700] }}>
                Completa tu perfil profesional
              </p>
              <p className="text-xs" style={{ color: colors.primary[600] }}>
                Un perfil completo mejora tu presencia profesional ({completeness}% completado)
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onComplete}
              style={{
                backgroundColor: colors.primary[500],
                color: colors.surface
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Completar Perfil
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDismissed(true)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}