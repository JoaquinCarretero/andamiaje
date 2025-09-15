"use client"

import type React from "react"
import { Clock, CheckCircle, TrendingUp, AlertTriangle, Calendar, Target } from "lucide-react"
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
  role: "terapeuta" | "acompanante" | "coordinador"
}

const roleStats = {
  terapeuta: [
    { 
      title: "Tareas Pendientes", 
      value: 5, 
      subtitle: "2 vencen esta semana", 
      icon: Clock, 
      color: colors.primary[500], 
      progress: 40,
      trend: "up" as const
    },
    { 
      title: "Documentos Completados", 
      value: "85%", 
      subtitle: "Este mes", 
      icon: CheckCircle, 
      color: colors.success[500], 
      progress: 85,
      trend: "up" as const
    },
    { 
      title: "Tareas Urgentes", 
      value: 3, 
      subtitle: "Requieren atención", 
      icon: AlertTriangle, 
      color: colors.error[500], 
      progress: 60,
      trend: "down" as const
    },
    { 
      title: "Productividad", 
      value: "92%", 
      subtitle: "Últimos 7 días", 
      icon: TrendingUp, 
      color: colors.accent[500], 
      progress: 92,
      trend: "up" as const
    },
  ],
  acompanante: [
    { 
      title: "Tareas Pendientes", 
      value: 3, 
      subtitle: "1 vence mañana", 
      icon: Clock, 
      color: colors.primary[500], 
      progress: 33,
      trend: "up" as const
    },
    { 
      title: "Documentos Completados", 
      value: "90%", 
      subtitle: "Este mes", 
      icon: CheckCircle, 
      color: colors.success[500], 
      progress: 90,
      trend: "up" as const
    },
    { 
      title: "Próximos Vencimientos", 
      value: 2, 
      subtitle: "Esta semana", 
      icon: Calendar, 
      color: colors.warning[500], 
      progress: 50,
      trend: "up" as const
    },
    { 
      title: "Eficiencia", 
      value: "88%", 
      subtitle: "Promedio mensual", 
      icon: Target, 
      color: colors.accent[500], 
      progress: 88,
      trend: "stable" as const
    },
  ],
  coordinador: [
    { 
      title: "Tareas de Supervisión", 
      value: 7, 
      subtitle: "4 pendientes de revisión", 
      icon: Clock, 
      color: colors.primary[500], 
      progress: 43,
      trend: "up" as const
    },
    { 
      title: "Documentos Revisados", 
      value: "78%", 
      subtitle: "Este mes", 
      icon: CheckCircle, 
      color: colors.success[500], 
      progress: 78,
      trend: "up" as const
    },
    { 
      title: "Alertas Activas", 
      value: 5, 
      subtitle: "Requieren seguimiento", 
      icon: AlertTriangle, 
      color: colors.error[500], 
      progress: 70,
      trend: "down" as const
    },
    { 
      title: "Gestión de Equipo", 
      value: "94%", 
      subtitle: "Eficiencia general", 
      icon: Target, 
      color: colors.accent[500], 
      progress: 94,
      trend: "up" as const
    },
  ],
}

export function DashboardStats({ role }: DashboardStatsProps) {
  const stats = roleStats[role] || []

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
                  {stat.trend === "up" && (
                    <TrendingUp className="w-4 h-4 text-green-500 rotate-0" />
                  )}
                  {stat.trend === "down" && (
                    <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                  )}
                  {stat.trend === "stable" && (
                    <TrendingUp className="w-4 h-4 text-gray-400 rotate-90" />
                  )}
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