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
  status: "completed" | "pending" | "review"
  priority: "high" | "medium" | "low"
}

export function DocumentsOverview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
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
      status: "completed",
      priority: "medium"
    },
    {
      id: 2,
      title: "Informe Inicial",
      type: "Informe Inicial",
      patientName: "Ana López",
      professionalName: "Dr. María González",
      professionalRole: "Terapeuta",
      date: "2024-01-20",
      status: "pending",
      priority: "high"
    },
    {
      id: 3,
      title: "Reporte Mensual - Enero",
      type: "Reporte Mensual",
      patientName: "Pedro Rodríguez",
      professionalName: "Prof. Ana Martínez",
      professionalRole: "Acompañante",
      date: "2024-01-30",
      status: "review",
      priority: "medium"
    },
    {
      id: 4,
      title: "Informe Semestral",
      type: "Informe Semestral",
      patientName: "María González",
      professionalName: "Dr. María González",
      professionalRole: "Terapeuta",
      date: "2024-01-25",
      status: "completed",
      priority: "low"
    },
    {
      id: 5,
      title: "Acta de Reunión",
      type: "Acta de Reunión",
      patientName: "Sofía Martín",
      professionalName: "Lucre Martínez",
      professionalRole: "Coordinador",
      date: "2024-01-28",
      status: "completed",
      priority: "medium"
    },
    {
      id: 6,
      title: "Plan de Trabajo",
      type: "Plan de Trabajo",
      patientName: "Diego Morales",
      professionalName: "Prof. Carlos López",
      professionalRole: "Acompañante",
      date: "2024-01-22",
      status: "pending",
      priority: "high"
    }
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge 
            className="text-xs"
            style={{
              backgroundColor: colors.success[500],
              color: colors.surface
            }}
          >
            Completado
          </Badge>
        )
      case "pending":
        return (
          <Badge 
            className="text-xs"
            style={{
              backgroundColor: colors.warning[500],
              color: colors.surface
            }}
          >
            Pendiente
          </Badge>
        )
      case "review":
        return (
          <Badge 
            className="text-xs"
            style={{
              backgroundColor: colors.info[500],
              color: colors.surface
            }}
          >
            En Revisión
          </Badge>
        )
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge 
            variant="outline"
            className="text-xs"
            style={{
              borderColor: colors.error[500],
              color: colors.error[600]
            }}
          >
            Alta
          </Badge>
        )
      case "medium":
        return (
          <Badge 
            variant="outline"
            className="text-xs"
            style={{
              borderColor: colors.warning[500],
              color: colors.warning[600]
            }}
          >
            Media
          </Badge>
        )
      case "low":
        return (
          <Badge 
            variant="outline"
            className="text-xs"
            style={{
              borderColor: colors.success[500],
              color: colors.success[600]
            }}
          >
            Baja
          </Badge>
        )
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    return <FileText className="h-4 w-4" style={{ color: colors.primary[500] }} />
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.professionalName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || doc.type === filterType
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
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
    <Card 
      className="shadow-soft border-0"
      style={{ 
        backgroundColor: colors.surface,
        borderColor: colors.border 
      }}
    >
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" style={{ color: colors.primary[500] }} />
            <span style={{ color: colors.text }}>Gestión de Documentos</span>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
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
      </CardHeader>
      
      <CardContent>
        {/* Filtros y búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: colors.text }}>
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.textMuted }} />
              <Input
                placeholder="Buscar documentos..."
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
              Tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text
              }}
            >
              <option value="all">Todos</option>
              <option value="Plan de Trabajo">Planes de Trabajo</option>
              <option value="Informe Inicial">Informes Iniciales</option>
              <option value="Informe Semestral">Informes Semestrales</option>
              <option value="Reporte Mensual">Reportes Mensuales</option>
              <option value="Acta de Reunión">Actas de Reunión</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: colors.text }}>
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text
              }}
            >
              <option value="all">Todos</option>
              <option value="completed">Completados</option>
              <option value="pending">Pendientes</option>
              <option value="review">En Revisión</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: colors.text }}>
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text
              }}
            >
              <option value="date">Fecha</option>
              <option value="patient">Paciente</option>
              <option value="professional">Profesional</option>
              <option value="type">Tipo</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: colors.text }}>
              Resultados
            </label>
            <div className="flex items-center h-10 px-3 py-2 text-sm rounded-md border" style={{ borderColor: colors.border }}>
              <span style={{ color: colors.textMuted }}>
                {sortedDocuments.length} documentos
              </span>
            </div>
          </div>
        </div>

        {/* Lista de documentos */}
        {sortedDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4" style={{ color: colors.textMuted }} />
            <p className="text-lg font-medium mb-2" style={{ color: colors.text }}>
              No se encontraron documentos
            </p>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              Ajusta los filtros para ver más resultados
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-4 border rounded-lg transition-all duration-200 hover:shadow-medium hover:scale-[1.01]"
                style={{ borderColor: colors.border }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="p-2 rounded-md flex-shrink-0"
                      style={{ backgroundColor: colors.primary[50] }}
                    >
                      {getTypeIcon(doc.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-sm" style={{ color: colors.text }}>
                          {doc.title}
                        </h3>
                        {getStatusBadge(doc.status)}
                        {getPriorityBadge(doc.priority)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" style={{ color: colors.textMuted }} />
                          <span style={{ color: colors.textSecondary }}>
                            <span className="font-medium">Paciente:</span> {doc.patientName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" style={{ color: colors.textMuted }} />
                          <span style={{ color: colors.textSecondary }}>
                            <span className="font-medium">Profesional:</span> {doc.professionalName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" style={{ color: colors.textMuted }} />
                          <span style={{ color: colors.textSecondary }}>
                            <span className="font-medium">Fecha:</span> {doc.date}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: colors.secondary[50],
                            color: colors.secondary[600]
                          }}
                        >
                          {doc.professionalRole}
                        </span>
                        <span 
                          className="text-xs px-2 py-1 rounded-full font-medium"
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

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-blue-50 hover:text-blue-600"
                      title="Ver documento"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-green-50 hover:text-green-600"
                      title="Editar documento"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-purple-50 hover:text-purple-600"
                      title="Descargar PDF"
                    >
                      <Download className="h-4 w-4" />
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