"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Trash2, CheckCircle, Calendar, AlertCircle } from "lucide-react"
import colors from "@/lib/colors"

export function InvoiceUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([
    { 
      id: 1, 
      name: "Factura_Enero_2024.pdf", 
      month: "Enero 2024", 
      uploadDate: "2024-01-31", 
      size: "245 KB" 
    },
    {
      id: 2,
      name: "Factura_Febrero_2024.pdf",
      month: "Febrero 2024",
      uploadDate: "2024-02-29",
      size: "198 KB",
    },
  ])

  const [formData, setFormData] = useState({
    month: "",
    description: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.month) {
      newErrors.month = "Debe seleccionar el mes"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Simular subida de archivo
      const newFile = {
        id: uploadedFiles.length + 1,
        name: `Factura_${formData.month.replace(' ', '_')}.pdf`,
        month: formData.month,
        uploadDate: new Date().toISOString().split('T')[0],
        size: "156 KB"
      }
      setUploadedFiles([...uploadedFiles, newFile])
      setFormData({ month: "", description: "" })
    }
  }

  const removeFile = (id: number) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Subir nueva factura */}
      <Card 
        className="shadow-soft border-0"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" style={{ color: colors.primary[500] }} />
            <span style={{ color: colors.text }}>Subir Factura Mensual</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-month" style={{ color: colors.text }}>
                  Mes de la Factura *
                </Label>
                <select 
                  id="invoice-month"
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                  className={`flex h-11 w-full rounded-md border px-3 py-2 text-sm transition-all duration-200 ${errors.month ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: errors.month ? colors.error[500] : colors.border,
                    color: colors.text
                  }}
                >
                  <option value="">Seleccionar mes</option>
                  <option value="Marzo 2024">Marzo 2024</option>
                  <option value="Abril 2024">Abril 2024</option>
                  <option value="Mayo 2024">Mayo 2024</option>
                  <option value="Junio 2024">Junio 2024</option>
                  <option value="Julio 2024">Julio 2024</option>
                  <option value="Agosto 2024">Agosto 2024</option>
                  <option value="Septiembre 2024">Septiembre 2024</option>
                  <option value="Octubre 2024">Octubre 2024</option>
                  <option value="Noviembre 2024">Noviembre 2024</option>
                  <option value="Diciembre 2024">Diciembre 2024</option>
                </select>
                {errors.month && (
                  <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                    <AlertCircle className="h-4 w-4" />
                    {errors.month}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-description" style={{ color: colors.text }}>
                  Descripción (Opcional)
                </Label>
                <Input 
                  id="invoice-description" 
                  placeholder="Ej: Sesiones de terapia ocupacional"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="h-11"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            {/* Zona de arrastrar y soltar */}
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 hover:border-primary/50"
              style={{ borderColor: colors.border }}
            >
              <Upload className="h-12 w-12 mx-auto mb-4" style={{ color: colors.textMuted }} />
              <p className="text-sm mb-2" style={{ color: colors.textMuted }}>
                Arrastra tu archivo PDF aquí o
              </p>
              <Button variant="outline" size="sm" type="button">
                Seleccionar archivo
              </Button>
              <p className="text-xs mt-2" style={{ color: colors.textMuted }}>
                Solo archivos PDF, máximo 10MB
              </p>
            </div>

            <Button 
              type="submit"
              className="w-full h-11"
              style={{
                backgroundColor: colors.primary[500],
                color: colors.surface
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir Factura
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Facturas subidas */}
      <Card 
        className="shadow-soft border-0"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" style={{ color: colors.secondary[500] }} />
            <span style={{ color: colors.text }}>Facturas Subidas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploadedFiles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4" style={{ color: colors.textMuted }} />
              <p className="text-sm" style={{ color: colors.textMuted }}>
                No hay facturas subidas aún
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg transition-colors duration-200 hover:bg-muted/50"
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-md"
                      style={{ backgroundColor: colors.primary[50] }}
                    >
                      <FileText className="h-5 w-5" style={{ color: colors.primary[500] }} />
                    </div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: colors.text }}>
                        {file.month}
                      </p>
                      <div className="flex items-center gap-4 text-xs" style={{ color: colors.textMuted }}>
                        <span>{file.size}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {file.uploadDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="default" 
                      className="text-xs"
                      style={{
                        backgroundColor: colors.success[500],
                        color: colors.surface
                      }}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Subida
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFile(file.id)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
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