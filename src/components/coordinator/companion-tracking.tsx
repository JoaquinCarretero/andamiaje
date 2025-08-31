"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, Download, Eye, Edit, Calendar, FileText } from "lucide-react"
import colors from "@/lib/colors"

interface CompanionReport {
  id: number
  companionName: string
  studentName: string
  reportType: string
  date: string
  month?: string
}

export function CompanionTracking() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const [reports] = useState<CompanionReport[]>([
    {
      id: 1,
      companionName: "Prof. Ana Martínez",
      studentName: "Juan Pérez",
      reportType: "Plan de Trabajo",
      date: "2024-01-15"
    },
    {
      id: 2,
      companionName: "Prof. Ana Martínez",
      studentName: "María González",
      reportType: "Reporte Mensual",
      date: "2024-01-30",
      month: "Enero 2024"
    },
    {
      id: 3,
      companionName: "Prof. Carlos López",
      studentName: "Pedro Rodríguez",
      reportType: "Plan de Trabajo",
      date: "2024-01-20"
    },
    {
      id: 4,
      companionName: "Prof. Carlos López",
      studentName: "Ana Silva",
      reportType: "Reporte Mensual",
      date: "2024-01-28",
      month: "Enero 2024"
    },
    {
      id: 5,
      companionName: "Prof. Laura Fernández",
      studentName: "Diego Morales",
      reportType: "Plan de Trabajo",
      date: "2024-01-25"
    },
    {
      id: 6,
      companionName: "Prof. Laura Fernández",
      studentName: "Sofía Martín",
      reportType: "Reporte Mensual",
      date: "2024-01-29",
      month: "Enero 2024"
    }
  ])

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.companionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || report.reportType === filterType
    
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Plan de Trabajo":
        return <FileText className="h-4 w-4" style={{ color: colors.primary[500] }} />
      case "Reporte Mensual":
        return <Calendar className="h-4 w-4" style={{ color: colors.secondary[500] }} />
      default:
        return <FileText className="h-4 w-4" style={{ color: colors.textMuted }} />
    }
  }

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
            <Users className="h-5 w-5" style={{ color: colors.primary[500] }} />
            <span style={{ color: colors.text }}>Seguimiento de Acompañantes Externos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: colors.text }}>
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.textMuted }} />
                <Input
                  placeholder="Buscar por acompañante o estudiante..."
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
                Tipo de Documento
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
                <option value="all">Todos los tipos</option>
                <option value="Plan de Trabajo">Planes de Trabajo</option>
                <option value="Reporte Mensual">Reportes Mensuales</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: colors.text }}>
                Acciones
              </label>
              <Button
                className="w-full"
                style={{
                  backgroundColor: colors.primary[500],
                  color: colors.surface
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports list */}
      <Card 
        className="shadow-soft border-0"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: colors.text }}>
            Reportes y Documentos ({filteredReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4" style={{ color: colors.textMuted }} />
              <p className="text-sm" style={{ color: colors.textMuted }}>
                No se encontraron reportes con los filtros aplicados
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-medium hover:scale-[1.02]"
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="p-2 rounded-md flex-shrink-0"
                      style={{ backgroundColor: colors.primary[50] }}
                    >
                      {getTypeIcon(report.reportType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium text-sm" style={{ color: colors.text }}>
                          {report.reportType}
                        </h3>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs" style={{ color: colors.textSecondary }}>
                          <span className="font-medium">Acompañante:</span> {report.companionName}
                        </p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>
                          <span className="font-medium">Estudiante:</span> {report.studentName}
                        </p>
                        <div className="flex items-center gap-4 text-xs" style={{ color: colors.textMuted }}>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {report.date}
                          </span>
                          {report.month && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {report.month}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-green-50 hover:text-green-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-purple-50 hover:text-purple-600"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
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