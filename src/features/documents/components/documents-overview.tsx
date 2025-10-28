import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from "@/ui"
import { FileText, Search, Download, Eye, Edit, Calendar, User, Phone, Mail, X, ChevronDown, ChevronUp, Filter } from "lucide-react"
import { UserProfilePopover } from "../../dashboard/components/user-profile-popover"
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

interface DocumentsOverviewProps {
  initialFilter?: string
}

// Función para normalizar texto (quitar acentos)
const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function DocumentsOverview({ initialFilter = "" }: DocumentsOverviewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterRole, setFilterRole] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null)
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 })

  const [documents] = useState<Document[]>([
    {
      id: 1,
      title: "Plan de Trabajo - Desarrollo Cognitivo",
      type: "Planes de Trabajo",
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
      type: "Informes Iniciales",
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
      type: "Reportes Mensuales",
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
      type: "Informes Semestrales",
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
      type: "Actas de Reunión",
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
      type: "Facturas",
      professionalName: "Prof. Carlos López",
      professionalRole: "Acompañante",
      professionalEmail: "carlos.lopez@andamiaje.com",
      professionalPhone: "+54 11 4567-8901",
      date: "2024-01-22",
    },
    {
      id: 7,
      title: "Plan de Trabajo - Habilidades Sociales",
      type: "Planes de Trabajo",
      patientName: "Diego Morales",
      professionalName: "Prof. Laura Fernández",
      professionalRole: "Acompañante",
      professionalEmail: "laura.fernandez@andamiaje.com",
      professionalPhone: "+54 11 5678-9012",
      date: "2024-01-18",
    },
    {
      id: 8,
      title: "Reporte Mensual - Diciembre 2023",
      type: "Reportes Mensuales",
      patientName: "Valentina Castro",
      professionalName: "Prof. Ana Martínez",
      professionalRole: "Acompañante",
      professionalEmail: "ana.martinez@andamiaje.com",
      professionalPhone: "+54 11 2345-6789",
      date: "2023-12-30",
    }
  ])

  // Escuchar eventos de filtro desde Vista General
  useEffect(() => {
    const handleDocumentFilter = (event: CustomEvent) => {
      const { type } = event.detail
      setFilterType(type)
    }

    window.addEventListener('applyDocumentFilter', handleDocumentFilter as EventListener)
    return () => window.removeEventListener('applyDocumentFilter', handleDocumentFilter as EventListener)
  }, [])

  const handleProfessionalClick = (event: React.MouseEvent, professional: any) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 10
    })
    setSelectedProfessional(professional)
  }

  const toggleCardCollapse = (id: number) => {
    // Funcionalidad removida
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterType("all")
    setFilterRole("all")
    setDateFrom("")
    setDateTo("")
  }

  const hasActiveFilters = searchTerm || filterType !== "all" || filterRole !== "all" || dateFrom || dateTo

  const filteredDocuments = documents.filter(doc => {
    // Búsqueda sin acentos
    const normalizedSearch = normalizeText(searchTerm)
    const matchesSearch = !searchTerm || 
      normalizeText(doc.title).includes(normalizedSearch) ||
      (doc.patientName && normalizeText(doc.patientName).includes(normalizedSearch)) ||
      normalizeText(doc.professionalName).includes(normalizedSearch)
    
    const matchesType = filterType === "all" || doc.type === filterType
    const matchesRole = filterRole === "all" || doc.professionalRole === filterRole
    
    // Filtro por fecha
    let matchesDate = true
    if (dateFrom || dateTo) {
      const docDate = new Date(doc.date)
      if (dateFrom) {
        matchesDate = matchesDate && docDate >= new Date(dateFrom)
      }
      if (dateTo) {
        matchesDate = matchesDate && docDate <= new Date(dateTo)
      }
    }
    
    return matchesSearch && matchesType && matchesRole && matchesDate
  })

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

  return (
    <div className="space-y-6 max-w-[95vw] mx-auto">
      {/* Filtros y búsqueda - Más ancho */}
      <Card 
        className="shadow-soft border-0"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }}
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium" style={{ color: colors.text }}>
                Buscar Documentos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.textMuted }} />
                <Input
                  placeholder="Buscar por título, paciente o profesional..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
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
                className="flex h-11 w-full rounded-md border px-3 py-2 text-sm"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                <option value="all">Todos</option>
                <option value="Planes de Trabajo">Planes de Trabajo</option>
                <option value="Informes Iniciales">Informes Iniciales</option>
                <option value="Informes Semestrales">Informes Semestrales</option>
                <option value="Reportes Mensuales">Reportes Mensuales</option>
                <option value="Actas de Reunión">Actas de Reunión</option>
                <option value="Facturas">Facturas</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: colors.text }}>
                Rol Profesional
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="flex h-11 w-full rounded-md border px-3 py-2 text-sm"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                <option value="all">Todos</option>
                <option value="Terapeuta">Terapeutas</option>
                <option value="Coordinador">Coordinadores</option>
                <option value="Acompañante">Acompañantes</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: colors.text }}>
                Desde
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-11"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: colors.text }}>
                Hasta
              </label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-11"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={clearFilters}
                    className="h-11 w-11 hover:bg-red-50 hover:text-red-600"
                    title="Limpiar filtros"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2">
              <Filter className="h-4 w-4" style={{ color: colors.primary[500] }} />
              <span className="text-sm font-medium" style={{ color: colors.primary[600] }}>
                Filtros activos: {filteredDocuments.length} de {documents.length} documentos
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de documentos - Cards rectangulares optimizadas */}
      <Card 
        className="shadow-soft border-0"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: colors.text }}>
            Documentos del Sistema ({filteredDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {filteredDocuments.length === 0 ? (
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
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => {
                const roleColors = getRoleColor(doc.professionalRole)
                
                return (
                  <div
                    key={doc.id}
                    className="border rounded-lg transition-all duration-200 hover:shadow-medium hover:scale-[1.02]"
                    style={{ borderColor: colors.border }}
                  >
                    {/* Vista única - Información completa */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2.5 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: colors.primary[50] }}
                          >
                            <FileText className="h-5 w-5" style={{ color: colors.primary[500] }} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base mb-1" style={{ color: colors.text }}>
                              {doc.title}
                            </h3>
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
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-sm mb-4">
                        {doc.patientName && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" style={{ color: colors.textMuted }} />
                            <span className="font-medium" style={{ color: colors.text }}>Paciente:</span>
                            <span style={{ color: colors.textSecondary }}>{doc.patientName}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" style={{ color: colors.textMuted }} />
                          <span className="font-medium" style={{ color: colors.text }}>Profesional:</span>
                          <button
                            onClick={(e) => handleProfessionalClick(e, {
                              name: doc.professionalName,
                              role: doc.professionalRole,
                              email: doc.professionalEmail,
                              phone: doc.professionalPhone
                            })}
                            className="hover:underline transition-colors duration-200"
                            style={{ color: colors.primary[500] }}
                          >
                            {doc.professionalName}
                          </button>
                          <span 
                            className="px-2 py-0.5 rounded text-xs font-medium ml-2"
                            style={{
                              backgroundColor: roleColors.bg,
                              color: roleColors.text
                            }}
                          >
                            {doc.professionalRole}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" style={{ color: colors.textMuted }} />
                          <span className="font-medium" style={{ color: colors.text }}>Fecha:</span>
                          <span style={{ color: colors.textSecondary }}>{doc.date}</span>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
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
                )
              })}
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