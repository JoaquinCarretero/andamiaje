"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, Download, Eye, Edit, Calendar, User, Filter, SortAsc } from "lucide-react"
import colors from "@/lib/colors"

interface Document {
  id: number
  title: string
  type: string
  patientName: string
  professionalName: string
  professionalRole: string
  date: string
}

export function DocumentsOverview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const [documents] = useState<Document[]>([
    {
      id: 1,
      title: "Plan de Trabajo",
      type: "Plan de Trabajo",
      patientName: "Juan Pérez",
      professionalName: "Dr. María González",
      professionalRole: "Terapeuta",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Informe Inicial",
      type: "Informe Inicial",
      patientName: "Ana López",
      professionalName: "Dr. María González",
      professionalRole: "Terapeuta",
      date: "2024-01-20",
    },
    {
      id: 3,
      title: "Reporte Mensual - Enero",
      type: "Reporte Mensual",
      patientName: "Pedro Rodríguez",
      professionalName: "Prof. Ana Martínez",
      professionalRole: "Acompañante",
      date: "2024-01-30",
    },
    {
      id: 4,
      title: "Informe Semestral",
      type: "Informe Semestral",
      patientName: "María González",
      professionalName: "Dr. María González",
      professionalRole: "Terapeuta",
      date: "2024-01-25",
    },
    {
      id: 5,
      title: "Acta de Reunión",
      type: "Acta de Reunión",
      patientName: "Sofía Martín",
      professionalName: "Lucre Martínez",
      professionalRole: "Coordinador",
      date: "2024-01-28",
    },
    {
      id: 6,
      title: "Plan de Trabajo",
      type: "Plan de Trabajo",
      patientName: "Diego Morales",
      professionalName: "Prof. Carlos López",
      professionalRole: "Acompañante",
      date: "2024-01-22",
    }
  ])

  const getTypeIcon = (type: string) => {
    return <FileText className="h-4 w-4" style={{ color: colors.primary[500] }} />
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.professionalName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || doc.type === filterType
    
    return matchesSearch && matchesType
  })

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "patient":
        return a.patientName.localeCompare(b.patientName)
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2" style={{ color: colors.text }}>
            Gestión de Documentos
          </h1>
          <p className="text-lg" style={{ color: colors.textSecondary }}>
            Control completo de todos los documentos del sistema
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="lg"
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

      <Card 
        className="shadow-soft border-0"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }}
      >
        <CardContent className="p-8">
          {/* Filtros y búsqueda */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                Resultados
              </label>
              <div 
                className="flex items-center justify-center h-12 px-4 rounded-md border font-medium"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.primary[50],
                  color: colors.primary[600]
                }}
              >
                {sortedDocuments.length} documentos
              </div>
            </div>
          </div>

          {/* Lista de documentos */}
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
                    <div className="flex items-center gap-6 flex-1">
                      <div
                        className="p-3 rounded-xl flex-shrink-0"
                        style={{ backgroundColor: colors.primary[50] }}
                      >
                        {getTypeIcon(doc.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-2" style={{ color: colors.text }}>
                          {doc.title}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" style={{ color: colors.textMuted }} />
                            <div>
                              <span className="font-medium" style={{ color: colors.text }}>Paciente:</span>
                              <br />
                              <span style={{ color: colors.textSecondary }}>{doc.patientName}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" style={{ color: colors.textMuted }} />
                            <div>
                              <span className="font-medium" style={{ color: colors.text }}>Profesional:</span>
                              <br />
                              <span style={{ color: colors.textSecondary }}>{doc.professionalName}</span>
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
                        
                        <div className="flex items-center gap-3">
                          <span 
                            className="text-sm px-3 py-1 rounded-full font-medium"
                            style={{
                              backgroundColor: colors.secondary[50],
                              color: colors.secondary[600]
                            }}
                          >
                            {doc.professionalRole}
                          </span>
                          <span 
                            className="text-sm px-3 py-1 rounded-full font-medium"
                            style={{
                              backgroundColor: colors.accent[50],
                              color: colors.accent[600]
                            }}
                          >
                            {doc.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="lg"
                        className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                        title="Ver documento"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                        title="Editar documento"
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
                        title="Descargar PDF"
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
    </div>
  )
}