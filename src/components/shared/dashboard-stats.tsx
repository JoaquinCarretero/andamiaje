"use client"

import type React from "react"

import { FileText, Calendar, Users, Upload, CheckCircle } from "lucide-react"

interface StatCard {
  title: string
  value: string | number
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  progress?: number
}

interface DashboardStatsProps {
  role: "terapeuta" | "acompanante"
}

const roleStats = {
  terapeuta: [
    {
      title: "Planes de Trabajo",
      value: 12,
      subtitle: "8 completados",
      icon: FileText,
      color: "text-emerald-600",
      progress: 67,
    },
    {
      title: "Informes Semestrales",
      value: 3,
      subtitle: "1 pendiente",
      icon: Calendar,
      color: "text-orange-600",
      progress: 33,
    },
    {
      title: "Actas Pendientes",
      value: 5,
      subtitle: "2 vencidas",
      icon: Users,
      color: "text-red-600",
      progress: 60,
    },
    {
      title: "Facturas Subidas",
      value: "8/12",
      subtitle: "Este año",
      icon: CheckCircle,
      color: "text-emerald-600",
      progress: 67,
    },
  ],
  acompanante: [
    {
      title: "Planes de Trabajo",
      value: 8,
      subtitle: "6 completados",
      icon: FileText,
      color: "text-emerald-600",
      progress: 75,
    },
    {
      title: "Reportes Mensuales",
      value: 11,
      subtitle: "1 pendiente",
      icon: Calendar,
      color: "text-orange-600",
      progress: 92,
    },
    {
      title: "Facturas ARCA",
      value: "10/12",
      subtitle: "Este año",
      icon: Upload,
      color: "text-emerald-600",
      progress: 83,
    },
    {
      title: "Tareas Completadas",
      value: 24,
      subtitle: "Este mes",
      icon: CheckCircle,
      color: "text-emerald-600",
      progress: 100,
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
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gray-50`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{stat.title}</h3>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-500">{stat.subtitle}</p>

              {stat.progress && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-orange-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
