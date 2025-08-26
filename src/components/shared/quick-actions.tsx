"use client"

import type React from "react"
import { Plus, FileText, Calendar, Upload, AlertTriangle } from "lucide-react"
import colors from "@/lib/colors"

interface QuickAction {
  id: string
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  urgent?: boolean
  buttonText: string
}

interface QuickActionsProps {
  role: "terapeuta" | "acompanante"
  onNavigate: (view: string) => void
}

const roleActions = {
  terapeuta: [
    { id: "plan-trabajo", title: "Nuevo Plan de Trabajo", subtitle: "Crear plan para nuevo paciente", icon: Plus, buttonText: "Crear" },
    { id: "informe-semestral", title: "Completar Informe", subtitle: "Informe semestral de Juan Pérez", icon: FileText, urgent: true, buttonText: "Completar" },
    { id: "actas", title: "Registrar Acta", subtitle: "Reunión del 15 de enero", icon: Calendar, buttonText: "Registrar" },
    { id: "facturas", title: "Subir Factura", subtitle: "Factura de diciembre 2024", icon: Upload, urgent: true, buttonText: "Subir" },
  ],
  acompanante: [
    { id: "plan-trabajo", title: "Nuevo Plan de Trabajo", subtitle: "Crear plan para nuevo estudiante", icon: Plus, buttonText: "Crear" },
    { id: "reporte-mensual", title: "Completar Reporte", subtitle: "Reporte mensual de enero 2025", icon: FileText, urgent: true, buttonText: "Completar" },
    { id: "facturas", title: "Subir Factura", subtitle: "Factura de diciembre 2024", icon: Upload, urgent: true, buttonText: "Subir" },
  ],
}

export function QuickActions({ role, onNavigate }: QuickActionsProps) {
  const actions = roleActions[role]

  return (
    <div
      className="rounded-xl shadow-soft border"
      style={{ 
        backgroundColor: colors.surface, 
        borderColor: colors.border,
        boxShadow: `0 4px 16px ${colors.shadow}`
      }}
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
          <h2 
            className="text-lg font-semibold font-display" 
            style={{ color: colors.text }}
          >
            Acciones Rápidas
          </h2>
        </div>

        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <div
                key={action.id}
                className="group p-4 rounded-lg border transition-all duration-200 hover:shadow-medium"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div
                      className="p-2.5 rounded-lg transition-colors duration-200"
                      style={{ 
                        backgroundColor: action.urgent ? colors.errorLight : colors.surfaceSecondary 
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ 
                          color: action.urgent ? colors.error : colors.primary 
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3
                          className="text-sm font-medium truncate"
                          style={{ color: colors.text }}
                        >
                          {action.title}
                        </h3>
                        {action.urgent && (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                            style={{
                              backgroundColor: colors.errorLight,
                              color: colors.error,
                            }}
                          >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgente
                          </span>
                        )}
                      </div>
                      <p
                        className="text-sm truncate"
                        style={{ color: colors.textMuted }}
                      >
                        {action.subtitle}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate(action.id)}
                    className="ml-4 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-sm transform hover:scale-105 whitespace-nowrap"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.surface,
                    }}
                  >
                    {action.buttonText}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}