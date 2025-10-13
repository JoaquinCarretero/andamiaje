"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Plus, FileText, Calendar, Upload, AlertTriangle, Users, Clock, CheckCircle } from "lucide-react"
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
  ],
  coordinador: [
    { id: "informe-inicial", title: "Completar Informe Inicial", subtitle: "Evaluación inicial pendiente", icon: FileText, urgent: true, buttonText: "Ir" },
    { id: "informe-semestral", title: "Completar Informe", subtitle: "Informe semestral de María López", icon: FileText, urgent: true, buttonText: "Ir" },
    { id: "plan-trabajo", title: "Nuevo Plan de Trabajo", subtitle: "Crear plan para nuevo estudiante", icon: Plus, buttonText: "Ir" },
    { id: "actas", title: "Registrar Acta", subtitle: "Reunión del 15 de enero", icon: Calendar, buttonText: "Ir" },
    { id: "facturas", title: "Subir Factura", subtitle: "Factura de diciembre 2024", icon: Upload, urgent: true, buttonText: "Ir" },
    { id: "reporte-mensual", title: "Revisar Reporte", subtitle: "Reporte mensual pendiente", icon: FileText, buttonText: "Ir" },
    { id: "seguimiento-flia", title: "Seguimiento Familias", subtitle: "Revisar comunicación familiar", icon: Users, buttonText: "Ir" },
  ],
}

export function QuickActions({ role, onNavigate }: QuickActionsProps) {
  const actions = roleActions[role]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl shadow-md border-0 overflow-hidden"
      style={{ 
        backgroundColor: colors.surface,
        boxShadow: `0 8px 25px ${colors.shadow}`
      }}
    >
      <div className="p-6">
        {/* Header mejorado */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-xl"
              style={{ backgroundColor: colors.primary[50] }}
            >
              <Clock className="h-5 w-5" style={{ color: colors.primary[500] }} />
            </div>
            <div>
              <h2 
                className="text-lg font-semibold font-display" 
                style={{ color: colors.text }}
              >
                Acciones Rápidas
              </h2>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                Tareas pendientes y urgentes
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: colors.warning[50] }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.warning[500] }} />
            <span className="text-xs font-medium" style={{ color: colors.warning[700] }}>
              {actions.filter(a => a.urgent).length} urgente{actions.filter(a => a.urgent).length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: action.urgent ? colors.error[200] : colors.border,
                  boxShadow: action.urgent ? `0 4px 12px ${colors.error[500]}15` : `0 2px 8px ${colors.shadow}`,
                }}
                onClick={() => onNavigate(action.id)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                    style={{ 
                      backgroundColor: action.urgent ? colors.error[50] : colors.primary[50]
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ 
                        color: action.urgent ? colors.error[500] : colors.primary[500]
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3
                        className="text-sm font-semibold leading-tight"
                        style={{ color: colors.text }}
                      >
                        {action.title}
                      </h3>
                      {action.urgent && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: colors.error[50] }}>
                          <AlertTriangle className="w-3 h-3" style={{ color: colors.error[600] }} />
                          <span className="text-xs font-medium" style={{ color: colors.error[700] }}>
                            Urgente
                          </span>
                        </div>
                      )}
                    </div>
                    <p
                      className="text-sm leading-relaxed line-clamp-2 mb-3"
                      style={{ color: colors.textMuted }}
                    >
                      {action.subtitle}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs" style={{ color: colors.textMuted }}>
                        <Clock className="h-3 w-3" />
                        <span>Hace 2 horas</span>
                      </div>
                      
                      <button
                        className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                        style={{
                          backgroundColor: action.urgent ? colors.error[500] : colors.primary[500],
                          color: colors.surface,
                        }}
                      >
                        {action.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}