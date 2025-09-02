"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Phone, Mail, Calendar, FileText, TrendingUp, User } from "lucide-react"
import colors from "@/lib/colors"

interface StaffMember {
  id: number
  name: string
  role: string
  specialty?: string
  email: string
  phone: string
  activePatients: number
  documentsThisMonth: number
  pendingDocuments: number
  lastActivity: string
  performance: "excellent" | "good" | "needs_attention"
}

export function StaffOverview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")

  const [staff] = useState<StaffMember[]>([
    {
      id: 1,
      name: "Dr. María González",
      role: "Terapeuta",
      specialty: "Terapia Ocupacional",
      email: "maria.gonzalez@andamiaje.com",
      phone: "+54 11 1234-5678",
      activePatients: 12,
      documentsThisMonth: 8,
      pendingDocuments: 2,
      lastActivity: "2024-01-30",
      performance: "excellent"
    },
    {
      id: 2,
      name: "Prof. Ana Martínez",
      role: "Acompañante",
      email: "ana.martinez@andamiaje.com",
      phone: "+54 11 2345-6789",
      activePatients: 8,
      documentsThisMonth: 6,
      pendingDocuments: 1,
      lastActivity: "2024-01-29",
      performance: "good"
    },
    {
      id: 3,
      name: "Lucre Martínez",
      role: "Coordinador",
      email: "lucre.martinez@andamiaje.com",
      phone: "+54 11 3456-7890",
      activePatients: 15,
      documentsThisMonth: 12,
      pendingDocuments: 3,
      lastActivity: "2024-01-30",
      performance: "excellent"
    },
    {
      id: 4,
      name: "Prof. Carlos López",
      role: "Acompañante",
      email: "carlos.lopez@andamiaje.com",
      phone: "+54 11 4567-8901",
      activePatients: 6,
      documentsThisMonth: 4,
      pendingDocuments: 4,
      lastActivity: "2024-01-25",
      performance: "needs_attention"
    }
  ])

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case "excellent":
        return (
          <Badge 
            className="text-xs"
            style={{
              backgroundColor: colors.success[500],
              color: colors.surface
            }}
          >
            Excelente
          </Badge>
        )
      case "good":
        return (
          <Badge 
            className="text-xs"
            style={{
              backgroundColor: colors.primary[500],
              color: colors.surface
            }}
          >
            Bueno
          </Badge>
        )
      case "needs_attention":
        return (
          <Badge 
            className="text-xs"
            style={{
              backgroundColor: colors.warning[500],
              color: colors.surface
            }}
          >
            Requiere Atención
          </Badge>
        )
      default:
        return null
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Terapeuta":
        return colors.primary[500]
      case "Acompañante":
        return colors.secondary[500]
      case "Coordinador":
        return colors.accent[500]
      default:
        return colors.textMuted
    }
  }

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || member.role === filterRole
    
    return matchesSearch && matchesRole
  })

  return (
    <Card 
      className="shadow-soft border-0"
      style={{ 
        backgroundColor: colors.surface,
        borderColor: colors.border 
      }}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" style={{ color: colors.secondary[500] }} />
          <span style={{ color: colors.text }}>Personal y Rendimiento</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: colors.text }}>
              Buscar Personal
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.textMuted }} />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: colors.text }}>
              Rol
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text
              }}
            >
              <option value="all">Todos los roles</option>
              <option value="Terapeuta">Terapeutas</option>
              <option value="Acompañante">Acompañantes</option>
              <option value="Coordinador">Coordinadores</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: colors.text }}>
              Estadísticas
            </label>
            <div className="flex items-center h-10 px-3 py-2 text-sm rounded-md border" style={{ borderColor: colors.border }}>
              <span style={{ color: colors.textMuted }}>
                {filteredStaff.length} miembros
              </span>
            </div>
          </div>
        </div>

        {/* Lista de personal */}
        {filteredStaff.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4" style={{ color: colors.textMuted }} />
            <p className="text-sm" style={{ color: colors.textMuted }}>
              No se encontró personal con los filtros aplicados
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStaff.map((member) => (
              <div
                key={member.id}
                className="p-4 border rounded-lg transition-all duration-200 hover:shadow-medium hover:scale-[1.01]"
                style={{ borderColor: colors.border }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${getRoleColor(member.role)}15` }}
                    >
                      <User className="h-5 w-5" style={{ color: getRoleColor(member.role) }} />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-medium text-base" style={{ color: colors.text }}>
                          {member.name}
                        </h3>
                        <span 
                          className="text-sm px-3 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: `${getRoleColor(member.role)}15`,
                            color: getRoleColor(member.role)
                          }}
                        >
                          {member.role}
                        </span>
                        {member.specialty && (
                          <span 
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: colors.neutral[100],
                              color: colors.textMuted
                            }}
                          >
                            {member.specialty}
                          </span>
                        )}
                        {getPerformanceBadge(member.performance)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" style={{ color: colors.textMuted }} />
                            <span style={{ color: colors.textSecondary }}>{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" style={{ color: colors.textMuted }} />
                            <span style={{ color: colors.textSecondary }}>{member.phone}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" style={{ color: colors.textMuted }} />
                            <span style={{ color: colors.textSecondary }}>
                              Última actividad: {member.lastActivity}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div 
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: colors.primary[50] }}
                        >
                          <p className="text-lg font-bold" style={{ color: colors.primary[600] }}>
                            {member.activePatients}
                          </p>
                          <p className="text-xs" style={{ color: colors.textMuted }}>
                            Pacientes Activos
                          </p>
                        </div>
                        <div 
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: colors.success[50] }}
                        >
                          <p className="text-lg font-bold" style={{ color: colors.success[600] }}>
                            {member.documentsThisMonth}
                          </p>
                          <p className="text-xs" style={{ color: colors.textMuted }}>
                            Docs. Este Mes
                          </p>
                        </div>
                        <div 
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: member.pendingDocuments > 2 ? colors.warning[50] : colors.neutral[50] }}
                        >
                          <p 
                            className="text-lg font-bold" 
                            style={{ color: member.pendingDocuments > 2 ? colors.warning[600] : colors.textMuted }}
                          >
                            {member.pendingDocuments}
                          </p>
                          <p className="text-xs" style={{ color: colors.textMuted }}>
                            Pendientes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-50 hover:text-blue-600"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Documentos
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-green-50 hover:text-green-600"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Rendimiento
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}