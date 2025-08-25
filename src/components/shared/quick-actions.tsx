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
    { id: "plan-trabajo", title: "Nuevo Plan de Trabajo", subtitle: "Crear plan para nuevo paciente", icon: Plus, buttonText: "Ir" },
    { id: "informe-semestral", title: "Completar Informe", subtitle: "Informe semestral de Juan Pérez", icon: FileText, urgent: true, buttonText: "Ir" },
    { id: "actas", title: "Registrar Acta", subtitle: "Reunión del 15 de enero", icon: Calendar, buttonText: "Ir" },
    { id: "facturas", title: "Subir Factura", subtitle: "Factura de diciembre 2024", icon: Upload, urgent: true, buttonText: "Ir" },
  ],
  acompanante: [
    { id: "plan-trabajo", title: "Nuevo Plan de Trabajo", subtitle: "Crear plan para nuevo estudiante", icon: Plus, buttonText: "Ir" },
    { id: "reporte-mensual", title: "Completar Reporte", subtitle: "Reporte mensual de enero 2025", icon: FileText, urgent: true, buttonText: "Ir" },
    { id: "facturas", title: "Subir Factura", subtitle: "Factura de diciembre 2024", icon: Upload, urgent: true, buttonText: "Ir" },
  ],
}

export function QuickActions({ role, onNavigate }: QuickActionsProps) {
  const actions = roleActions[role]

  return (
    <div
      className="rounded-lg shadow-sm border p-6"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <div className="flex items-center space-x-2 mb-6">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: colors.primary }}
        ></div>
        <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
          Acciones Rápidas
        </h2>
      </div>

      <div className="space-y-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <div
              key={action.id}
              className="flex items-center justify-between p-4 rounded-lg transition-colors"
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div className="flex items-center space-x-4">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.hover }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: action.urgent ? colors.error : colors.primary }}
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
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
                        style={{
                          backgroundColor: "#fee2e2", // rojo muy claro
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
                className="ml-1 px-5 py-2 text-sm font-medium rounded-lg transition-colors flex-shrink-0"
                style={{
                  backgroundColor: colors.primary,
                  color: "#ffffff",
                }}
              >
                {action.buttonText}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
