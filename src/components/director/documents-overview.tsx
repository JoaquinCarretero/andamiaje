"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, Download, Eye, Edit, Calendar, User, Phone, Mail, ExternalLink } from "lucide-react"
import { UserProfilePopover } from "@/components/director/user-profile-popover"
import colors from "@/lib/colors"

interface Document {
  id: number
  title: string
  type: string
  patientName?: string
  professionalName: string
  professionalRole: string
  professionalEmail: string
  professionalPhone: string
  date: string
}

export function DocumentsOverview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null)
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 })

  const [documents] = useState<Document[]>([
    {
      id: 1,
      title: "Plan de Trabajo - Desarrollo Cognitivo",
      type: "Plan de Trabajo",
      patientName: "Juan Pérez",
      professionalName: "Dr. María González",
      professionalRole: "Terapeuta",
      professionalEmail: "maria.gonzalez@andamiaje.com",
      professionalPhone: "+54 11 1234-5678",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Informe Inicial - Evaluación Neuropsicológica",
      type: "Informe Inicial",
      patientName: "Ana López",
      professionalName: "Dr. María González",
      professionalRole: "Terapeuta",
      professionalEmail: "maria.gonzalez@andamiaje.com",
      professionalPhone: "+54 11 1234-5678",
      date: "2024-01-20",
    },
    {
      id: 3,
      title: "Reporte Mensual - Enero 2024",
      type: "Reporte Mensual",
      patientName: "Pedro Rodríguez",
      professionalName: "Prof. Ana Martínez",
      professionalRole: "Acompañante",
      professionalEmail: "ana.martinez@andamiaje.com",
      professionalPhone: "+54 11 2345-6789",
      date: "2024-01-30",
    },
    {
      id: 4,
      title: "Informe Semestral - Primer Semestre",
      type: "Informe Semestral",
      patientName: "María González",
      professionalName: "Dr. María González",
      professionalRole: "Terapeuta",
      professionalEmail: "maria.gonzalez@andamiaje.com",
      professionalPhone: "+54 11 1234-5678",
      date: "2024-01-25",
    },
    {
      id: 5,
      title: "Acta de Reunión - Evaluación Trimestral",
      type: "Acta de Reunión",
      patientName: "Sofía Martín",
      professionalName: "Lucre Martínez",
      professionalRole: "Coordinador",
      professionalEmail: "lucre.martinez@andamiaje.com",
      professionalPhone: "+54 11 3456-7890",
      date: "2024-01-28",
    },
    {
      id: 6,
      title: "Factura Mensual - Enero",
      type: "Factura",
      professionalName: "Prof. Carlos López",
      professionalRole: "Acompañante",
      professionalEmail: "carlos.lopez@andamiaje.com",
      professionalPhone: "+54 11 4567-8901",
      date: "2024-01-22",
    }
  ])

  const handleProfessionalClick = (event: React.MouseEvent, professional: any) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 10
    })
    setSelectedProfessional(professional)
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.patientName && doc.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         doc.professionalName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || doc.type === filterType
    
    return matchesSearch && matchesType
  })

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "patient":
        return (a.patientName || "").localeCompare(b.patientName || "")
      case "professional":
        return a.professionalName.localeCompare(b.professionalName)
      case "type":
        return a.type.localeCompare(b.type)
      default:
        return 0
    }
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: colors.text }}>
                Buscar Documentos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.textMuted }} />
                <Input
                  placeholder="Buscar por título, paciente o profesional..."
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
                Tipo de Documento
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex h-12 w-full rounded-md border px-3 py-2 text-sm"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                <option value="all">Todos los tipos</option>
                <option value="Plan de Trabajo">Planes de Trabajo</option>
                <option value="Informe Inicial">Informes Iniciales</option>
                <option value="Informe Semestral">Informes Semestrales</option>
                <option value="Reporte Mensual">Reportes Mensuales</option>
                <option value="Acta de Reunión">Actas de Reunión</option>
                <option value="Factura">Facturas</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: colors.text }}>
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex h-12 w-full rounded-md border px-3 py-2 text-sm"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                <option value="date">Fecha (Más reciente)</option>
                <option value="patient">Paciente (A-Z)</option>
                <option value="professional">Profesional (A-Z)</option>
                <option value="type">Tipo de Documento</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: colors.text }}>
                Acciones
              </label>
              <Button
                className="w-full h-12"
                style={{
                  backgroundColor: colors.primary[500],
                  color: colors.surface
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Todo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de documentos */}
      <Card 
        className="shadow-soft border-0"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: colors.text }}>
            Documentos del Sistema ({sortedDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedDocuments.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 mx-auto mb-4" style={{ color: colors.textMuted }} />
              <p className="text-lg font-medium mb-2" style={{ color: colors.text }}>
                No se encontraron documentos
              </p>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                Ajusta los filtros para ver más resultados
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-6 border rounded-xl transition-all duration-200 hover:shadow-medium hover:scale-[1.01]"
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div
                        className="p-3 rounded-xl flex-shrink-0"
                        style={{ backgroundColor: colors.primary[50] }}
                      >
                        <FileText className="h-5 w-5" style={{ color: colors.primary[500] }} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-3 truncate" style={{ color: colors.text }}>
                          {doc.title}
                        </h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium" style={{ color: colors.text }}>Tipo:</span>
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: colors.accent[50],
                                color: colors.accent[600]
                              }}
                            >
                              {doc.type}
                            </span>
                          </div>
                          
                          {doc.patientName && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" style={{ color: colors.textMuted }} />
                              <div>
                                <span className="font-medium" style={{ color: colors.text }}>Paciente:</span>
                                <br />
                                <span style={{ color: colors.textSecondary }}>{doc.patientName}</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" style={{ color: colors.textMuted }} />
                            <div>
                              <span className="font-medium" style={{ color: colors.text }}>Profesional:</span>
                              <br />
                              <button
                                onClick={(e) => handleProfessionalClick(e, {
                                  name: doc.professionalName,
                                  role: doc.professionalRole,
                                  email: doc.professionalEmail,
                                  phone: doc.professionalPhone
                                })}
                                className="text-left hover:underline transition-colors duration-200"
                                style={{ color: colors.primary[500] }}
                              >
                                {doc.professionalName}
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" style={{ color: colors.textMuted }} />
                            <div>
                              <span className="font-medium" style={{ color: colors.text }}>Fecha:</span>
                              <br />
                              <span style={{ color: colors.textSecondary }}>{doc.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="lg"
                        className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        size="lg"
                        className="hover:shadow-lg"
                        style={{
                          backgroundColor: colors.primary[500],
                          color: colors.surface
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popover de perfil de usuario */}
      <UserProfilePopover
        isOpen={!!selectedProfessional}
        onClose={() => setSelectedProfessional(null)}
        professional={selectedProfessional}
        position={popoverPosition}
      />
    </div>
  )
}