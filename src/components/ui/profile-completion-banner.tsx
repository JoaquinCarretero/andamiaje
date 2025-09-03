"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, User, Award, Briefcase, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import colors from "@/lib/colors"

interface ProfileCompletionBannerProps {
  userProfile: {
    bio?: string
    specialty?: string
    license?: string
    phone?: string
    address?: string
  }
  onStartEditing: () => void
}

export function ProfileCompletionBanner({ userProfile, onStartEditing }: ProfileCompletionBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  // Calcular completitud del perfil
  const profileFields = [
    { key: 'bio', label: 'Biografía profesional', icon: User },
    { key: 'specialty', label: 'Especialidad', icon: Award },
    { key: 'license', label: 'Matrícula profesional', icon: Briefcase },
    { key: 'phone', label: 'Teléfono actualizado', icon: Phone },
    { key: 'address', label: 'Dirección', icon: User }
  ]

  const completedFields = profileFields.filter(field => 
    userProfile[field.key as keyof typeof userProfile]?.trim()
  )
  
  const completionPercentage = Math.round((completedFields.length / profileFields.length) * 100)
  const missingFields = profileFields.filter(field => 
    !userProfile[field.key as keyof typeof userProfile]?.trim()
  )

  // No mostrar si está completo al 100% o si fue descartado
  if (completionPercentage === 100 || isDismissed) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Card 
          className="border-0 shadow-soft"
          style={{ 
            backgroundColor: colors.primary[50],
            borderLeft: `4px solid ${colors.primary[500]}`
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.primary[100] }}
                  >
                    <User className="h-5 w-5" style={{ color: colors.primary[600] }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: colors.primary[700] }}>
                      Completa tu perfil profesional
                    </h3>
                    <p className="text-sm" style={{ color: colors.primary[600] }}>
                      Un perfil completo mejora tu presencia profesional
                    </p>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: colors.primary[700] }}>
                      Progreso del perfil
                    </span>
                    <span className="text-sm font-bold" style={{ color: colors.primary[600] }}>
                      {completionPercentage}%
                    </span>
                  </div>
                  <div 
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.primary[100] }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: colors.primary[500] }}
                    />
                  </div>
                </div>

                {/* Campos faltantes */}
                {missingFields.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2" style={{ color: colors.primary[700] }}>
                      Campos pendientes:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {missingFields.slice(0, 3).map((field) => {
                        const Icon = field.icon
                        return (
                          <div
                            key={field.key}
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                            style={{
                              backgroundColor: colors.primary[100],
                              color: colors.primary[700]
                            }}
                          >
                            <Icon className="h-3 w-3" />
                            {field.label}
                          </div>
                        )
                      })}
                      {missingFields.length > 3 && (
                        <div
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: colors.primary[200],
                            color: colors.primary[800]
                          }}
                        >
                          +{missingFields.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  onClick={onStartEditing}
                  size="sm"
                  className="w-fit"
                  style={{
                    backgroundColor: colors.primary[500],
                    color: colors.surface
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completar Perfil
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDismissed(true)}
                className="rounded-full flex-shrink-0"
                style={{ color: colors.primary[400] }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}