"use client"

import type React from "react"
import { Plus, FileText, Calendar, Upload, AlertTriangle, Users } from "lucide-react"
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
  role: "terapeuta" | "acompanante" | "coordinador"
  onNavigate: (view: string) => void
}

const roleActions = {
  terapeuta: [
    { id: "plan-trabajo", title: "Nuevo Plan de Trabajo", subtitle: "Crear plan para nuevo paciente", icon: Plus, buttonText: "Ir" },
    { id: "informe-inicial", title: "Completar Informe Inicial", subtitle: "Evaluación inicial de María López", icon: FileText, urgent: true, buttonText: "Ir" },
    { id: "informe-semestral", title: "Completar Informe", subtitle: "Informe semestral de Juan Pérez", icon: FileText, urgent: true, buttonText: "Ir" },
    { id: "actas", title: "Registrar Acta", subtitle: "Reunión del 15 de enero", icon: Calendar, buttonText: "Ir" },
    { id: "facturas", title: "Subir Factura", subtitle: "Factura de diciembre 2024", icon: Upload, urgent: true, buttonText: "Ir" },
  ],
  acompanante: [
    { id: "plan-trabajo", title: "Nuevo Plan de Trabajo", subtitle: "Crear plan para nuevo estudiante", icon: Plus, buttonText: "Ir" },
    { id: "reporte-mensual", title: "Completar Reporte", subtitle: "Reporte mensual de enero 2025", icon: FileText, urgent: true, buttonText: "Ir" },
    { id: "facturas", title: "Subir Factura", subtitle: "Factura de diciembre 2024", icon: Upload, urgent: true, buttonText: "Ir" },
  ],
  coordinador: [
    { id: "informe-semestral", title: "Completar Informe", subtitle: "Informe semestral de María López", icon: FileText, urgent: true, buttonText: "Ir" },
    { id: "informe-inicial", title: "Completar Informe Inicial", subtitle: "Evaluación inicial pendiente", icon: FileText, urgent: true, buttonText: "Ir" },
    { id: "plan-trabajo", title: "Nuevo Plan de Trabajo", subtitle: "Crear plan para nuevo estudiante", icon: Plus, buttonText: "Ir" },
    { id: "actas", title: "Registrar Acta", subtitle: "Reunión del 15 de enero", icon: Calendar, buttonText: "Ir" },
    { id: "reporte-mensual", title: "Revisar Reporte", subtitle: "Reporte mensual pendiente", icon: FileText, buttonText: "Ir" },
    { id: "seguimiento-flia", title: "Seguimiento Familias", subtitle: "Gestionar comunicación familiar", icon: Users, buttonText: "Ir" },
    { id: "facturas", title: "Subir Factura", subtitle: "Factura de diciembre 2024", icon: Upload, urgent: true, buttonText: "Ir" },
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
            style={{ backgroundColor: colors.primary[500] }}
          />
          <h2 
            className="text-lg font-semibold font-display" 
            style={{ color: colors.text }}
          >
            Acciones Rápidas
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 auto-rows-min">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <div
                key={action.id}
                className="group p-2.5 rounded-lg border transition-all duration-200 hover:shadow-medium"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-1.5 rounded-lg transition-colors duration-200 flex-shrink-0"
                    style={{ 
                      backgroundColor: action.urgent ? colors.error[50] : colors.primary[50]
                    }}
                  >
                    <Icon
                      className="w-3.5 h-3.5"
                      style={{ 
                        color: action.urgent ? colors.error[500] : colors.primary[500]
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <h3
                        className="text-xs font-medium leading-tight"
                        style={{ color: colors.text }}
                      >
                        {action.title}
                      </h3>
                      {action.urgent && (
                        <span
                          className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                          style={{
                            backgroundColor: colors.error[50],
                            color: colors.error[600],
                          }}
                        >
                          <AlertTriangle className="w-2 h-2 mr-0.5" />
                          Urgente
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs leading-tight line-clamp-2"
                      style={{ color: colors.textMuted }}
                    >
                      {action.subtitle}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => onNavigate(action.id)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-200 hover:shadow-sm transform hover:scale-105 whitespace-nowrap flex-shrink-0"
                    style={{
                      backgroundColor: colors.primary[500],
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