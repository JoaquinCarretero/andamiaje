"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock, Target } from "lucide-react"
import colors from "@/lib/colors"

export function SystemStats() {
  const stats = [
    {
      title: "Total Documentos",
      value: 156,
      subtitle: "12 este mes",
      icon: FileText,
      color: colors.primary[500],
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Personal Activo",
      value: 24,
      subtitle: "4 roles diferentes",
      icon: Users,
      color: colors.secondary[500],
      trend: "+2",
      trendUp: true
    },
    {
      title: "Pacientes Activos",
      value: 89,
      subtitle: "15 nuevos este mes",
      icon: Target,
      color: colors.accent[500],
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Documentos Pendientes",
      value: 8,
      subtitle: "3 vencen esta semana",
      icon: AlertTriangle,
      color: colors.warning[500],
      trend: "-2",
      trendUp: false
    },
    {
      title: "Completados Hoy",
      value: 5,
      subtitle: "Meta: 8 documentos",
      icon: CheckCircle,
      color: colors.success[500],
      trend: "63%",
      trendUp: true
    },
    {
      title: "Tiempo Promedio",
      value: "2.3h",
      subtitle: "Por documento",
      icon: Clock,
      color: colors.info[500],
      trend: "-15min",
      trendUp: true
    }
  ]

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <Card 
        className="shadow-soft border-0"
        style={{ 
          backgroundColor: colors.surface,
          background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.neutral[50]} 100%)`
        }}
      >
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2" style={{ color: colors.text }}>
                Panel de Control Directivo
              </h1>
              <p className="text-lg" style={{ color: colors.textSecondary }}>
                Supervisión completa del sistema y control de calidad
              </p>
            </div>
            <div 
              className="p-4 rounded-xl"
              style={{ backgroundColor: colors.primary[50] }}
            >
              <TrendingUp className="h-8 w-8" style={{ color: colors.primary[500] }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="shadow-soft border-0 transition-all duration-200 hover:shadow-medium hover:scale-105"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ 
                      backgroundColor: `${stat.color}15`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp 
                      className={`w-3 h-3 ${stat.trendUp ? 'text-green-500' : 'text-red-500 rotate-180'}`}
                    />
                    <span 
                      className={`text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium" style={{ color: colors.textMuted }}>
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold font-display" style={{ color: colors.text }}>
                    {stat.value}
                  </p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>
                    {stat.subtitle}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}