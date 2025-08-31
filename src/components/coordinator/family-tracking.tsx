"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, Phone, Mail, Calendar, User, Users, MessageCircle } from "lucide-react"
import colors from "@/lib/colors"

interface Family {
  id: number
  studentName: string
  parentNames: string
  phone: string
  email: string
  lastContact: string
  notes: string
  nextMeeting?: string
}

export function FamilyTracking() {
  const [searchTerm, setSearchTerm] = useState("")

  const [families] = useState<Family[]>([
    {
      id: 1,
      studentName: "Juan Pérez",
      parentNames: "María Pérez y Carlos Pérez",
      phone: "+54 11 1234-5678",
      email: "maria.perez@email.com",
      lastContact: "2024-01-28",
      notes: "Familia muy colaborativa, asisten regularmente a las reuniones",
      nextMeeting: "2024-02-15"
    },
    {
      id: 2,
      studentName: "Ana González",
      parentNames: "Laura González",
      phone: "+54 11 2345-6789",
      email: "laura.gonzalez@email.com",
      lastContact: "2024-01-20",
      notes: "Necesita seguimiento más frecuente, preocupaciones sobre el progreso"
    },
    {
      id: 3,
      studentName: "Pedro Rodríguez",
      parentNames: "José Rodríguez y Carmen Rodríguez",
      phone: "+54 11 3456-7890",
      email: "jose.rodriguez@email.com",
      lastContact: "2024-01-25",
      notes: "Reunión programada para revisar objetivos del trimestre",
      nextMeeting: "2024-02-10"
    },
    {
      id: 4,
      studentName: "Sofía Martín",
      parentNames: "Elena Martín",
      phone: "+54 11 4567-8901",
      email: "elena.martin@email.com",
      lastContact: "2024-01-30",
      notes: "Excelente comunicación, muy involucrada en el proceso"
    }
  ])

  const filteredFamilies = families.filter(family => {
    const matchesSearch = family.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         family.parentNames.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <Card 
        className="shadow-soft border-0"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" style={{ color: colors.secondary[500] }} />
            <span style={{ color: colors.text }}>Seguimiento de Familias</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: colors.text }}>
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.textMuted }} />
                <Input
                  placeholder="Buscar por estudiante o familia..."
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
                Estadísticas
              </label>
              <div className="flex items-center gap-4 text-sm">
                <span style={{ color: colors.textMuted }}>
                  Total: <span className="font-medium" style={{ color: colors.text }}>{families.length}</span>
                </span>
                <span style={{ color: colors.primary[500] }}>
                  Familias: <span className="font-medium">{filteredFamilies.length}</span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Families list */}
      <Card 
        className="shadow-soft border-0"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: colors.text }}>
              Familias ({filteredFamilies.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFamilies.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4" style={{ color: colors.textMuted }} />
              <p className="text-sm" style={{ color: colors.textMuted }}>
                No se encontraron familias con los filtros aplicados
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFamilies.map((family) => (
                <div
                  key={family.id}
                  className="p-4 border rounded-lg transition-all duration-200 hover:shadow-medium hover:scale-[1.02]"
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div
                          className="p-2 rounded-md flex-shrink-0"
                          style={{ backgroundColor: colors.secondary[50] }}
                        >
                          <User className="h-4 w-4" style={{ color: colors.secondary[500] }} />
                        </div>
                        <div>
                          <h3 className="font-medium" style={{ color: colors.text }}>
                            {family.studentName}
                          </h3>
                          <p className="text-sm" style={{ color: colors.textSecondary }}>
                            {family.parentNames}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" style={{ color: colors.textMuted }} />
                            <span style={{ color: colors.textSecondary }}>{family.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" style={{ color: colors.textMuted }} />
                            <span style={{ color: colors.textSecondary }}>{family.email}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" style={{ color: colors.textMuted }} />
                            <span style={{ color: colors.textSecondary }}>
                              Último contacto: {family.lastContact}
                            </span>
                          </div>
                          {family.nextMeeting && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" style={{ color: colors.primary[500] }} />
                              <span style={{ color: colors.primary[600] }}>
                                Próxima reunión: {family.nextMeeting}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className="p-3 rounded-lg text-sm"
                        style={{ backgroundColor: colors.neutral[50] }}
                      >
                        <p style={{ color: colors.textSecondary }}>
                          <span className="font-medium">Notas:</span> {family.notes}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-green-50 hover:text-green-600"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-purple-50 hover:text-purple-600"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Notas
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}