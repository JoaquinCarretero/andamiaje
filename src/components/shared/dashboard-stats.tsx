"use client"

import type React from "react"
import { FileText, Calendar, Users, Upload, CheckCircle, TrendingUp } from "lucide-react"
import colors from "@/lib/colors"

interface StatCard {
  title: string
  value: string | number
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  progress?: number
  trend?: "up" | "down" | "stable"
}

interface DashboardStatsProps {
  role: "terapeuta" | "acompanante"
}

const roleStats = {
  terapeuta: [
    { 
      title: "Pacientes Activos", 
      value: 12, 
      subtitle: "8 en progreso", 
      icon: Users, 
      color: colors.primary[500], 
      progress: 67,
      trend: "up" as const
    },
    { 
      title: "Sesiones del Mes", 
      value: 48, 
      subtitle: "3 pendientes", 
      icon: Calendar, 
      color: colors.accent[500], 
      progress: 94,
      trend: "up" as const
    },
    { 
      title: "Informes Pendientes", 
      value: 3, 
      subtitle: "1 vence hoy", 
      icon: FileText, 
      color: colors.warning[500], 
      progress: 33,
      trend: "stable" as const
    },
    { 
      title: "Tareas Completadas", 
      value: "85%", 
      subtitle: "Este mes", 
      icon: CheckCircle, 
      color: colors.success[500], 
      progress: 85,
      trend: "up" as const
    },
  ],
  acompanante: [
    { 
      title: "Estudiantes Activos", 
      value: 8, 
      subtitle: "6 en seguimiento", 
      icon: Users, 
      color: colors.primary[500], 
      progress: 75,
      trend: "up" as const
    },
    { 
      title: "Reportes del Mes", 
      value: 7, 
      subtitle: "1 pendiente", 
      icon: Calendar, 
      color: colors.accent[500], 
      progress: 88,
      trend: "up" as const
    },
    { 
      title: "Actividades Realizadas", 
      value: 24, 
      subtitle: "Esta semana", 
      icon: TrendingUp, 
      color: colors.success[500], 
      progress: 100,
      trend: "up" as const
    },
    { 
      title: "Documentos Subidos", 
      value: "92%", 
      subtitle: "Completado", 
      icon: Upload, 
      color: colors.primary[500], 
      progress: 92,
      trend: "stable" as const
    },
  ],
}

export function DashboardStats({ role }: DashboardStatsProps) {
  const stats = roleStats[role]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="group rounded-xl shadow-soft border p-6 transition-all duration-200 hover:shadow-medium hover:scale-105"
            style={{ 
              backgroundColor: colors.surface, 
              borderColor: colors.border 
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="p-3 rounded-lg transition-colors duration-200"
                style={{ 
                  backgroundColor: `${stat.color}15`,
                }}
              >
                <Icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              {stat.trend && (
                <div className="flex items-center space-x-1">
                  <TrendingUp 
                    className={`w-4 h-4 ${
                      stat.trend === 'up' ? 'text-green-500 rotate-0' : 
                      stat.trend === 'down' ? 'text-red-500 rotate-180' : 
                      'text-gray-400 rotate-90'
                    }`} 
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium mb-1" style={{ color: colors.textMuted }}>
                  {stat.title}
                </h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold font-display" style={{ color: colors.text }}>
                    {stat.value}
                  </span>
                </div>
              </div>
              
              <p className="text-sm" style={{ color: colors.textMuted }}>
                {stat.subtitle}
              </p>

              {stat.progress && (
                <div className="space-y-2">
                  <div
                    className="w-full rounded-full h-2 overflow-hidden"
                    style={{ backgroundColor: colors.neutral[100] }}
                  >
                    <div
                      className="h-2 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${stat.progress}%`,
                        backgroundColor: stat.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: colors.textMuted }}>
                    <span>Progreso</span>
                    <span>{stat.progress}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}