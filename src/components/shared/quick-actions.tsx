"use client"

import type React from "react"

import { Plus, FileText, Calendar, Upload, AlertTriangle } from "lucide-react"

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
    {
      id: "plan-trabajo",
      title: "Nuevo Plan de Trabajo",
      subtitle: "Crear plan para nuevo paciente",
      icon: Plus,
      buttonText: "Ir",
    },
    {
      id: "informe-semestral",
      title: "Completar Informe",
      subtitle: "Informe semestral de Juan Pérez",
      icon: FileText,
      urgent: true,
      buttonText: "Ir",
    },
    {
      id: "actas",
      title: "Registrar Acta",
      subtitle: "Reunión del 15 de enero",
      icon: Calendar,
      buttonText: "Ir",
    },
    {
      id: "facturas",
      title: "Subir Factura",
      subtitle: "Factura de diciembre 2024",
      icon: Upload,
      urgent: true,
      buttonText: "Ir",
    },
  ],
  acompanante: [
    {
      id: "plan-trabajo",
      title: "Nuevo Plan de Trabajo",
      subtitle: "Crear plan para nuevo estudiante",
      icon: Plus,
      buttonText: "Ir",
    },
    {
      id: "reporte-mensual",
      title: "Completar Reporte",
      subtitle: "Reporte mensual de enero 2025",
      icon: FileText,
      urgent: true,
      buttonText: "Ir",
    },
    {
      id: "facturas",
      title: "Subir Factura ARCA",
      subtitle: "Factura de diciembre 2024",
      icon: Upload,
      urgent: true,
      buttonText: "Ir",
    },
  ],
}

export function QuickActions({ role, onNavigate }: QuickActionsProps) {
  const actions = roleActions[role]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
      </div>

      <div className="space-y-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <div
              key={action.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{action.title}</h3>
                    {action.urgent && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Urgente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{action.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate(action.id)}
                className="ml-4 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex-shrink-0"
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
