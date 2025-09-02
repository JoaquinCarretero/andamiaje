"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, Save, Send, Clock, AlertCircle, Eye } from "lucide-react"
import { PDFPreviewModal } from "@/components/ui/pdf-preview-modal"
import { useSignature } from "@/lib/signature-storage"
import colors from "@/lib/colors"

export function MeetingMinutesForm() {
  const { getSignature } = useSignature()
  const [showPDFPreview, setShowPDFPreview] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    meetingDate: new Date().toISOString().split('T')[0],
    modality: "",
    subject: ""
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

    if (!formData.patientName.trim()) {
      newErrors.patientName = "El nombre del paciente es obligatorio"
    }

    if (!formData.meetingDate) {
      newErrors.meetingDate = "La fecha de la reunión es obligatoria"
    }

    if (!formData.modality) {
      newErrors.modality = "La modalidad es obligatoria"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "El asunto es obligatorio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setShowPDFPreview(true)
    }
  }

  const signature = getSignature()

  const pdfContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Información de la Reunión</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Paciente:</strong> {formData.patientName}</div>
          <div><strong>Fecha:</strong> {formData.meetingDate}</div>
          <div><strong>Modalidad:</strong> {formData.modality}</div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Asunto de la Reunión</h3>
        <p>{formData.subject}</p>
      </div>
    </div>
  )

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Información de la Reunión */}
        <Card 
          className="shadow-soft border-0"
          style={{ 
            backgroundColor: colors.surface,
            borderColor: colors.border 
          }}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle 
                className="text-lg border-l-4 pl-4"
                style={{ 
                  color: colors.text,
                  borderLeftColor: colors.primary[500]
                }}
              >
                Información de la Reunión
              </CardTitle>
              <Badge 
                variant="outline" 
                className="flex items-center gap-1"
                style={{ 
                  backgroundColor: colors.accent[50], 
                  color: colors.accent[700],
                  borderColor: colors.accent[200]
                }}
              >
                <Clock className="h-3 w-3" />
                En progreso
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient-name" style={{ color: colors.text }}>
                Paciente *
              </Label>
              <Input 
                id="patient-name" 
                placeholder="Ej: Juan Carlos Pérez González"
                value={formData.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                className={`h-11 ${errors.patientName ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: errors.patientName ? colors.error[500] : colors.border,
                  color: colors.text
                }}
              />
              {errors.patientName && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.patientName}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="meeting-date" style={{ color: colors.text }}>
                  Fecha *
                </Label>
                <Input 
                  id="meeting-date" 
                  type="date"
                  value={formData.meetingDate}
                  onChange={(e) => handleInputChange('meetingDate', e.target.value)}
                  className={`h-11 ${errors.meetingDate ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: errors.meetingDate ? colors.error[500] : colors.border,
                    color: colors.text
                  }}
                />
                {errors.meetingDate && (
                  <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                    <AlertCircle className="h-4 w-4" />
                    {errors.meetingDate}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="modality" style={{ color: colors.text }}>
                  Modalidad *
                </Label>
                <select 
                  id="modality"
                  value={formData.modality}
                  onChange={(e) => handleInputChange('modality', e.target.value)}
                  className={`flex h-11 w-full rounded-md border px-3 py-2 text-sm transition-all duration-200 ${errors.modality ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: errors.modality ? colors.error[500] : colors.border,
                    color: colors.text
                  }}
                >
                  <option value="">Seleccionar modalidad</option>
                  <option value="presencial">Presencial</option>
                  <option value="virtual">Virtual</option>
                </select>
                {errors.modality && (
                  <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                    <AlertCircle className="h-4 w-4" />
                    {errors.modality}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asunto de la Reunión */}
        <Card 
          className="shadow-soft border-0"
          style={{ 
            backgroundColor: colors.surface,
            borderColor: colors.border 
          }}
        >
          <CardHeader className="pb-4">
            <CardTitle 
              className="text-lg border-l-4 pl-4"
              style={{ 
                color: colors.text,
                borderLeftColor: colors.secondary[500]
              }}
            >
              Asunto de la Reunión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="subject" style={{ color: colors.text }}>
                Asunto *
              </Label>
              <Textarea
                id="subject"
                placeholder="Describe el asunto principal de la reunión, temas a tratar, objetivos..."
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className={`min-h-[200px] resize-none ${errors.subject ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: errors.subject ? colors.error[500] : colors.border,
                  color: colors.text
                }}
              />
              {errors.subject && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.subject}
                </div>
              )}
              <p className="text-xs" style={{ color: colors.textMuted }}>
                Incluye todos los detalles relevantes sobre el propósito y contenido de la reunión
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botones de acción */}
      <Card 
        className="mt-6 shadow-soft border-0"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }}
      >
        <CardContent className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant="outline"
                  style={{
                    borderColor: colors.border,
                    color: colors.textSecondary
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Borrador
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPDFPreview(true)}
                  disabled={!formData.patientName}
                  style={{
                    borderColor: colors.border,
                    color: colors.textSecondary
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Vista Previa
                </Button>
              </div>

              <Button
                type="submit"
                style={{
                  backgroundColor: colors.primary[500],
                  color: colors.surface
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Finalizar Acta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <PDFPreviewModal
        isOpen={showPDFPreview}
        onClose={() => setShowPDFPreview(false)}
        title="Acta de Reunión"
        content={pdfContent}
        patientName={formData.patientName}
        professionalName="Dr. María González"
        date={formData.meetingDate}
      />
    </>
  )
}