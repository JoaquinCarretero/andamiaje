"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Label, useAutoSave, SaveIndicator } from "@/ui"
import { FileText, Save, Send, AlertCircle, Eye } from "lucide-react"
import { PDFPreviewModal } from "../../utils/pdf-preview-modal"
import { useSignature } from "@/lib/signature-storage"
import colors from "@/lib/colors"

export default function SemesterReportForm() {
  const { getSignature } = useSignature()
  const [showPDFPreview, setShowPDFPreview] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    dni: "",
    birthDate: "",
    diagnosis: "",
    professionalName: "",
    specialty: "",
    license: "",
    date: new Date().toISOString().split('T')[0],
    attentionPeriod: "",
    characterization: "",
    periodEvolution: "",
    suggestions: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const { saveStatus, lastSaved, triggerSave } = useAutoSave({
    onSave: async (data: typeof formData) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      localStorage.setItem('semesterReport_draft', JSON.stringify({
        ...data,
        savedAt: new Date().toISOString()
      }))
    },
    debounceMs: 2000,
    onError: (error) => {
      console.error('Error al guardar borrador:', error)
    }
  })

  useEffect(() => {
    const savedDraft = localStorage.getItem('semesterReport_draft')
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        const { savedAt, ...draftData } = draft
        setFormData(draftData)
      } catch (error) {
        console.error('Error al cargar borrador:', error)
      }
    }
  }, [])

  const lastSavedDataRef = useRef<string>("");

  useEffect(() => {
    const hasSignificantData = formData.patientName.trim() || formData.professionalName.trim() || formData.diagnosis.trim()

    const currentDataString = JSON.stringify(formData);

    if (hasSignificantData && currentDataString !== lastSavedDataRef.current) {
      lastSavedDataRef.current = currentDataString;
      triggerSave(formData);
    }
  }, [formData, triggerSave])

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

    if (!formData.professionalName.trim()) {
      newErrors.professionalName = "El nombre del profesional es obligatorio"
    }

    if (!formData.specialty.trim()) {
      newErrors.specialty = "La especialidad es obligatoria"
    }

    if (!formData.license.trim()) {
      newErrors.license = "La matrícula es obligatoria"
    }

    if (!formData.attentionPeriod.trim()) {
      newErrors.attentionPeriod = "El período de atención es obligatorio"
    }

    if (!formData.characterization.trim()) {
      newErrors.characterization = "La caracterización es obligatoria"
    }

    if (!formData.periodEvolution.trim()) {
      newErrors.periodEvolution = "La evolución del período es obligatoria"
    }

    if (!formData.suggestions.trim()) {
      newErrors.suggestions = "Las sugerencias son obligatorias"
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
        <h3 className="text-lg font-semibold mb-4">Datos del Profesional</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Profesional:</strong> {formData.professionalName}</div>
          <div><strong>Especialidad:</strong> {formData.specialty}</div>
          <div><strong>Matrícula:</strong> {formData.license}</div>
          <div><strong>Período de Atención:</strong> {formData.attentionPeriod}</div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Informe Semestral</h3>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Caracterización:</h4>
          <p>{formData.characterization}</p>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Evolución del Período:</h4>
          <p>{formData.periodEvolution}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Sugerencias:</h4>
          <p>{formData.suggestions}</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Layout horizontal optimizado - 3 columnas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
                  value={calculateAge(formData.birthDate)}
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
                  Fecha *
                </Label>
                <Input 
                  id="report-date" 
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
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
                className={`min-h-[100px] resize-none ${errors.diagnosis ? 'border-red-500' : ''}`}
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

        {/* Datos del Profesional */}
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
                borderLeftColor: colors.accent[500]
              }}
            >
              Datos del Profesional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="professional-name" style={{ color: colors.text }}>
                Profesional (Nombre Completo) *
              </Label>
              <Input 
                id="professional-name" 
                placeholder="Dr. María González López"
                value={formData.professionalName}
                onChange={(e) => handleInputChange('professionalName', e.target.value)}
                className={`h-11 ${errors.professionalName ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: errors.professionalName ? colors.error[500] : colors.border,
                  color: colors.text
                }}
              />
              {errors.professionalName && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.professionalName}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="specialty" style={{ color: colors.text }}>
                  Especialidad *
                </Label>
                <Input 
                  id="specialty" 
                  placeholder="Terapia Ocupacional"
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  className={`h-11 ${errors.specialty ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: errors.specialty ? colors.error[500] : colors.border,
                    color: colors.text
                  }}
                />
                {errors.specialty && (
                  <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                    <AlertCircle className="h-4 w-4" />
                    {errors.specialty}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="license" style={{ color: colors.text }}>
                  Matrícula *
                </Label>
                <Input 
                  id="license" 
                  placeholder="MP 12345"
                  value={formData.license}
                  onChange={(e) => handleInputChange('license', e.target.value)}
                  className={`h-11 ${errors.license ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: errors.license ? colors.error[500] : colors.border,
                    color: colors.text
                  }}
                />
                {errors.license && (
                  <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                    <AlertCircle className="h-4 w-4" />
                    {errors.license}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attention-period" style={{ color: colors.text }}>
                Período de Atención *
              </Label>
              <Input 
                id="attention-period" 
                placeholder="Primer semestre 2024"
                value={formData.attentionPeriod}
                onChange={(e) => handleInputChange('attentionPeriod', e.target.value)}
                className={`h-11 ${errors.attentionPeriod ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: errors.attentionPeriod ? colors.error[500] : colors.border,
                  color: colors.text
                }}
              />
              {errors.attentionPeriod && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.attentionPeriod}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Información del Informe */}
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
              Información del Informe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="characterization" style={{ color: colors.text }}>
                Caracterización *
              </Label>
              <Textarea
                id="characterization"
                placeholder="Características actuales del paciente..."
                value={formData.characterization}
                onChange={(e) => handleInputChange('characterization', e.target.value)}
                className={`min-h-[100px] resize-none ${errors.characterization ? 'border-red-500' : ''}`}
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

            <div className="space-y-2">
              <Label htmlFor="period-evolution" style={{ color: colors.text }}>
                Evolución del Período *
              </Label>
              <Textarea
                id="period-evolution"
                placeholder="Evolución durante el período evaluado..."
                value={formData.periodEvolution}
                onChange={(e) => handleInputChange('periodEvolution', e.target.value)}
                className={`min-h-[100px] resize-none ${errors.periodEvolution ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: errors.periodEvolution ? colors.error[500] : colors.border,
                  color: colors.text
                }}
              />
              {errors.periodEvolution && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.periodEvolution}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="suggestions" style={{ color: colors.text }}>
                Sugerencias *
              </Label>
              <Textarea
                id="suggestions"
                placeholder="Sugerencias para el próximo período..."
                value={formData.suggestions}
                onChange={(e) => handleInputChange('suggestions', e.target.value)}
                className={`min-h-[100px] resize-none ${errors.suggestions ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: errors.suggestions ? colors.error[500] : colors.border,
                  color: colors.text
                }}
              />
              {errors.suggestions && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.suggestions}
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
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => triggerSave(formData)}
                  style={{
                    borderColor: colors.border,
                    color: colors.textSecondary
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Borrador
                </Button>
                <SaveIndicator status={saveStatus} lastSaved={lastSaved} />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPDFPreview(true)}
                  disabled={!formData.patientName || !formData.professionalName}
                  style={{
                    borderColor: colors.border,
                    color: colors.textSecondary
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Vista Previa
                </Button>

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
            </div>
          </form>
        </CardContent>
      </Card>

      <PDFPreviewModal
        isOpen={showPDFPreview}
        onClose={() => setShowPDFPreview(false)}
        title="Informe Semestral"
        content={pdfContent}
        patientName={formData.patientName}
        professionalName={formData.professionalName}
        date={formData.date}
      />
    </>
  )
}