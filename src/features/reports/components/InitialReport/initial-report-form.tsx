"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Label, useAutoSave, SaveIndicator } from "@/ui"
import { FileText, Save, Send, AlertCircle, Eye } from "lucide-react"
import { PDFPreviewModal } from "../../utils/pdf-preview-modal"
import { useSignature } from "@/lib/signature-storage"
import colors from "@/lib/colors"
import { useToast } from "@/lib/hooks/use-toast"
import { calculateAge, formatDate } from "@/lib/date-utils"

export function InitialReportForm() {
  const { getSignature } = useSignature()
  const { toast } = useToast()
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

  const { saveStatus, lastSaved, triggerSave } = useAutoSave({
    onSave: async (data: typeof formData) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      localStorage.setItem('initialReport_draft', JSON.stringify({
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
    const savedDraft = localStorage.getItem('initialReport_draft')
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
    const hasSignificantData = formData.patientName.trim() || formData.diagnosis.trim()

    const currentDataString = JSON.stringify(formData);

    if (hasSignificantData && currentDataString !== lastSavedDataRef.current) {
      lastSavedDataRef.current = currentDataString;
      triggerSave(formData);
    }
  }, [formData, triggerSave])


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
      toast({
        title: "Informe enviado (simulado)",
        description: "El informe se ha enviado correctamente.",
        variant: "success",
      });
    }
  }

  const ageResult = calculateAge(formData.birthDate);
  const calculatedAge = typeof ageResult === 'number' ? `${ageResult} años` : ageResult;
  const signature = getSignature()

  const pdfContent = (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4 pb-2 border-b-2" style={{ borderColor: colors.primary[300] }}>Datos del Paciente</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-base">
          <div><strong style={{ color: colors.primary[600] }}>Nombre:</strong> {formData.patientName}</div>
          <div><strong style={{ color: colors.primary[600] }}>DNI:</strong> {formData.dni}</div>
          <div><strong style={{ color: colors.primary[600] }}>Fecha de Nacimiento:</strong> {formatDate(formData.birthDate)}</div>
          <div><strong style={{ color: colors.primary[600] }}>Edad:</strong> {calculatedAge}</div>
        </div>
        <div className="mt-4">
          <p><strong style={{ color: colors.primary[600] }}>Diagnóstico (según CUD):</strong></p>
          <p className="mt-2 text-base">{formData.diagnosis}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 pb-2 border-b-2" style={{ borderColor: colors.primary[300] }}>Información Clínica</h3>
        
        <div className="mb-6">
          <h4 className="text-lg font-bold underline mb-2" style={{ color: colors.secondary[600] }}>Introducción:</h4>
          <p className="text-base">{formData.introduction}</p>
        </div>

        <div>
          <h4 className="text-lg font-bold underline mb-2" style={{ color: colors.secondary[600] }}>Caracterización:</h4>
          <p className="text-base">{formData.characterization}</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Layout horizontal optimizado - 2 columnas */}
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
                  disabled={!formData.patientName}
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
        title="Informe Inicial"
        content={pdfContent}
        patientName={formData.patientName}
        professionalName="Dr. María González"
        date={formData.reportDate}
      />
    </>
  )
}