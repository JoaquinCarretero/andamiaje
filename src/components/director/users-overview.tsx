"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Phone, Mail, User, Calendar, FileText, ExternalLink, MessageCircle } from "lucide-react"
import colors from "@/lib/colors"

interface UserData {
  id: number
  name: string
  role: string
  email: string
  phone: string
  joinDate: string
  documentsCount: number
  lastActivity: string
  specialty?: string
}

export function UsersOverview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")

  const [users] = useState<UserData[]>([
    {
      id: 1,
      name: "Dr. María González",
      role: "Terapeuta",
      email: "maria.gonzalez@andamiaje.com",
      phone: "+54 11 1234-5678",
      joinDate: "2023-03-15",
      documentsCount: 24,
      lastActivity: "2024-01-30",
      specialty: "Terapia Ocupacional"
    },
    {
      id: 2,
      name: "Prof. Ana Martínez",
      role: "Acompañante",
      email: "ana.martinez@andamiaje.com",
      phone: "+54 11 2345-6789",
      joinDate: "2023-06-20",
      documentsCount: 18,
      lastActivity: "2024-01-29"
    },
    {
      id: 3,
      name: "Lucre Martínez",
      role: "Coordinador",
      email: "lucre.martinez@andamiaje.com",
      phone: "+54 11 3456-7890",
      joinDate: "2023-01-10",
      documentsCount: 32,
      lastActivity: "2024-01-30"
    },
    {
      id: 4,
      name: "Prof. Carlos López",
      role: "Acompañante",
      email: "carlos.lopez@andamiaje.com",
      phone: "+54 11 4567-8901",
      joinDate: "2023-08-12",
      documentsCount: 15,
      lastActivity: "2024-01-28"
    },
    {
      id: 5,
      name: "Prof. Laura Fernández",
      role: "Acompañante",
      email: "laura.fernandez@andamiaje.com",
      phone: "+54 11 5678-9012",
      joinDate: "2023-09-05",
      documentsCount: 12,
      lastActivity: "2024-01-27"
    }
  ])

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '')
    const message = encodeURIComponent(`Hola ${name}, te contacto desde Andamiaje.`)
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank')
  }

  const openEmail = (email: string, name: string) => {
    const subject = encodeURIComponent('Contacto desde Andamiaje')
    const body = encodeURIComponent(`Hola ${name},\n\nTe contacto desde la plataforma Andamiaje.\n\nSaludos.`)
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank')
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Terapeuta":
        return { bg: colors.primary[50], text: colors.primary[600] }
      case "Coordinador":
        return { bg: colors.secondary[50], text: colors.secondary[600] }
      case "Acompañante":
        return { bg: colors.accent[50], text: colors.accent[600] }
      default:
        return { bg: colors.neutral[50], text: colors.neutral[600] }
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card 
        className="shadow-soft border-0"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }}
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: colors.text }}>
                Buscar Usuarios
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.textMuted }} />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
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
                Filtrar por Rol
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="flex h-12 w-full rounded-md border px-3 py-2 text-sm"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                <option value="all">Todos los roles</option>
                <option value="Terapeuta">Terapeutas</option>
                <option value="Coordinador">Coordinadores</option>
                <option value="Acompañante">Acompañantes</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: colors.text }}>
                Total de Usuarios
              </label>
              <div 
                className="flex items-center justify-center h-12 px-4 rounded-md border font-medium"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.primary[50],
                  color: colors.primary[600]
                }}
              >
                {filteredUsers.length} usuarios
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-[95vw] mx-auto">
        {filteredUsers.map((user) => {
          const roleColors = getRoleColor(user.role)
          return (
            <Card
              key={user.id}
              className="shadow-soft border-0 transition-all duration-200 hover:shadow-medium hover:scale-[1.01]"
              style={{ 
                backgroundColor: colors.surface,
                borderColor: colors.border 
              }}
            >
              <CardContent className="p-5">
                <div className="space-y-4">
                  {/* Header del usuario */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: roleColors.bg }}
                      >
                        <User className="h-5 w-5" style={{ color: roleColors.text }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base" style={{ color: colors.text }}>
                          {user.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span 
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: roleColors.bg,
                              color: roleColors.text
                            }}
                          >
                            {user.role}
                          </span>
                          {user.specialty && (
                            <span 
                              className="px-2 py-0.5 rounded text-xs"
                              style={{
                                backgroundColor: colors.neutral[100],
                                color: colors.textMuted
                              }}
                            >
                              {user.specialty}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información del usuario */}
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 flex-shrink-0" style={{ color: colors.textMuted }} />
                      <span style={{ color: colors.textSecondary }} className="truncate text-xs">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 flex-shrink-0" style={{ color: colors.textMuted }} />
                      <span style={{ color: colors.textSecondary }} className="text-xs">
                        {user.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: colors.textMuted }} />
                      <span style={{ color: colors.textSecondary }} className="text-xs">
                        Ingreso: {user.joinDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 flex-shrink-0" style={{ color: colors.textMuted }} />
                      <span style={{ color: colors.textSecondary }} className="text-xs">
                        {user.documentsCount} documentos creados
                      </span>
                    </div>
                  </div>

                  {/* Acciones de contacto */}
                  <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: colors.border }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openWhatsApp(user.phone, user.name)}
                      className="flex-1 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEmail(user.email, user.name)}
                      className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}