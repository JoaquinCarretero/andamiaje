"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText, Save, Send, AlertCircle, Eye } from "lucide-react"
import { PDFPreviewModal } from "@/components/ui/pdf-preview-modal"
import { useSignature } from "@/lib/signature-storage"
import colors from "@/lib/colors"

export function InitialReportForm() {
  const { getSignature } = useSignature()
  const [showPDFPreview, setShowPDFPreview] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    dni: "",
    birthDate: "",
    diagnosis: "",
    reportDate: new Date().toISOString().split('T')[0],
    introduction: "",
    characterization: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return ""
    
    const birth = new Date(birthDate)
    const today = new Date()
    
    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()
    
    if (months < 0) {
      years--
      months += 12
    }
    
    if (years < 10) {
      return `${years} años${months > 0 ? ` y ${months} meses` : ""}`
    }
    return `${years} años`
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleDniChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    handleInputChange('dni', numericValue)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientName.trim()) {
      newErrors.patientName = "El nombre del paciente es obligatorio"
    }

    if (!formData.dni.trim()) {
      newErrors.dni = "El DNI es obligatorio"
    } else if (formData.dni.length < 7 || formData.dni.length > 8) {
      newErrors.dni = "El DNI debe tener entre 7 y 8 dígitos"
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "La fecha de nacimiento es obligatoria"
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = "El diagnóstico según CUD es obligatorio"
    }

    if (!formData.introduction.trim()) {
      newErrors.introduction = "La introducción es obligatoria"
    }

    if (!formData.characterization.trim()) {
      newErrors.characterization = "La caracterización es obligatoria"
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

  const calculatedAge = calculateAge(formData.birthDate)
  const signature = getSignature()

  const pdfContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Datos del Paciente</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Nombre:</strong> {formData.patientName}</div>
          <div><strong>DNI:</strong> {formData.dni}</div>
          <div><strong>Fecha de Nacimiento:</strong> {formData.birthDate}</div>
          <div><strong>Edad:</strong> {calculatedAge}</div>
        </div>
        <div className="mt-4">
          <p><strong>Diagnóstico (según CUD):</strong></p>
          <p className="mt-2">{formData.diagnosis}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Información Clínica</h3>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Introducción:</h4>
          <p>{formData.introduction}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Caracterización:</h4>
          <p>{formData.characterization}</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Datos del Paciente */}
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
                borderLeftColor: colors.primary[500]
              }}
            >
              Datos del Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient-name" style={{ color: colors.text }}>
                Paciente (Nombre Completo) *
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
                <Label htmlFor="patient-dni" style={{ color: colors.text }}>
                  DNI *
                </Label>
                <Input 
                  id="patient-dni" 
                  placeholder="12345678"
                  value={formData.dni}
                  onChange={(e) => handleDniChange(e.target.value)}
                  maxLength={8}
                  className={`h-11 ${errors.dni ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: errors.dni ? colors.error[500] : colors.border,
                    color: colors.text
                  }}
                />
                {errors.dni && (
                  <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                    <AlertCircle className="h-4 w-4" />
                    {errors.dni}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-birth-date" style={{ color: colors.text }}>
                  Fecha Nac. *
                </Label>
                <Input 
                  id="patient-birth-date" 
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className={`h-11 ${errors.birthDate ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: errors.birthDate ? colors.error[500] : colors.border,
                    color: colors.text
                  }}
                />
                {errors.birthDate && (
                  <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                    <AlertCircle className="h-4 w-4" />
                    {errors.birthDate}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="patient-age" style={{ color: colors.text }}>
                  Edad
                </Label>
                <Input 
                  id="patient-age" 
                  value={calculatedAge}
                  placeholder="Automático"
                  className="h-11"
                  style={{
                    backgroundColor: colors.neutral[50],
                    borderColor: colors.border,
                    color: colors.textMuted
                  }}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-date" style={{ color: colors.text }}>
                  Fecha Informe *
                </Label>
                <Input 
                  id="report-date" 
                  type="date"
                  value={formData.reportDate}
                  onChange={(e) => handleInputChange('reportDate', e.target.value)}
                  className="h-11"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis-cud" style={{ color: colors.text }}>
                Diagnóstico (según CUD) *
              </Label>
              <Textarea
                id="diagnosis-cud"
                placeholder="Describe el diagnóstico según el CUD..."
                value={formData.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                className={`min-h-[120px] resize-none ${errors.diagnosis ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: errors.diagnosis ? colors.error[500] : colors.border,
                  color: colors.text
                }}
              />
              {errors.diagnosis && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.diagnosis}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Información Clínica */}
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
              Información Clínica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="introduction" style={{ color: colors.text }}>
                Introducción *
              </Label>
              <Textarea
                id="introduction"
                placeholder="Motivo de consulta, antecedentes relevantes..."
                value={formData.introduction}
                onChange={(e) => handleInputChange('introduction', e.target.value)}
                className={`min-h-[140px] resize-none ${errors.introduction ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: errors.introduction ? colors.error[500] : colors.border,
                  color: colors.text
                }}
              />
              {errors.introduction && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.introduction}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="characterization" style={{ color: colors.text }}>
                Caracterización *
              </Label>
              <Textarea
                id="characterization"
                placeholder="Características principales: fortalezas, dificultades..."
                value={formData.characterization}
                onChange={(e) => handleInputChange('characterization', e.target.value)}
                className={`min-h-[140px] resize-none ${errors.characterization ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: errors.characterization ? colors.error[500] : colors.border,
                  color: colors.text
                }}
              />
              {errors.characterization && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.characterization}
                </div>
              )}
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
                Enviar Informe
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <PDFPreviewModal
        isOpen={showPDFPreview}
        onClose={() => setShowPDFPreview(false)}
        title="Informe Inicial"
        content={pdfContent}
        patientName={formData.patientName}
        professionalName="Dr. María González"
        date={formData.reportDate}
      />
    </>
  )
}