"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText, Save, Send, AlertCircle, Plus, Trash2, Eye } from "lucide-react"
import { PDFPreviewModal } from "@/components/ui/pdf-preview-modal"
import { PDFContent } from "@/components/ui/pdf-generator"
import { useSignature } from "@/lib/signature-storage"
import colors from "@/lib/colors"

export function WorkPlanForm() {
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
    period: "",
    date: new Date().toISOString().split('T')[0],
    rationale: "",
    generalObjectives: [""],
    specificObjectives: [""],
    approach: ""
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

  const handleObjectiveChange = (type: 'generalObjectives' | 'specificObjectives', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((obj, i) => i === index ? value : obj)
    }))
  }

  const addObjective = (type: 'generalObjectives' | 'specificObjectives') => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ""]
    }))
  }

  const removeObjective = (type: 'generalObjectives' | 'specificObjectives', index: number) => {
    if (formData[type].length > 1) {
      setFormData(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }))
    }
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

    if (!formData.period.trim()) {
      newErrors.period = "El período es obligatorio"
    }

    if (!formData.rationale.trim()) {
      newErrors.rationale = "La fundamentación es obligatoria"
    }

    if (formData.generalObjectives.every(obj => !obj.trim())) {
      newErrors.generalObjectives = "Debe incluir al menos un objetivo general"
    }

    if (formData.specificObjectives.every(obj => !obj.trim())) {
      newErrors.specificObjectives = "Debe incluir al menos un objetivo específico"
    }

    if (!formData.approach.trim()) {
      newErrors.approach = "La modalidad de abordaje es obligatoria"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Mostrar vista previa antes de enviar
      setShowPDFPreview(true)
    }
  }

  const calculatedAge = calculateAge(formData.birthDate)
  const signature = getSignature()

  // Contenido para el PDF
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
          <div><strong>Período:</strong> {formData.period}</div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Plan de Trabajo</h3>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Fundamentación:</h4>
          <p>{formData.rationale}</p>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Objetivos Generales:</h4>
          <ul className="list-disc list-inside space-y-1">
            {formData.generalObjectives.filter(obj => obj.trim()).map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Objetivos Específicos:</h4>
          <ul className="list-disc list-inside space-y-1">
            {formData.specificObjectives.filter(obj => obj.trim()).map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Modalidad de Abordaje:</h4>
          <p>{formData.approach}</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
    <Card 
      className="w-full shadow-soft border-0"
      style={{ 
        backgroundColor: colors.surface,
        borderColor: colors.border 
      }}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" style={{ color: colors.primary[500] }} />
          <span style={{ color: colors.text }}>Plan de Trabajo</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos del Paciente */}
          <div 
            className="p-4 rounded-lg border-l-4 space-y-4"
            style={{ 
              backgroundColor: colors.primary[50],
              borderLeftColor: colors.primary[500]
            }}
          >
            <h3 className="font-medium" style={{ color: colors.text }}>
              Datos del Paciente
            </h3>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-dni" style={{ color: colors.text }}>
                  DNI (Número) *
                </Label>
                <Input 
                  id="patient-dni" 
                  placeholder="Ej: 12345678"
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
                  Fecha de Nacimiento *
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-age" style={{ color: colors.text }}>
                  Edad
                </Label>
                <Input 
                  id="patient-age" 
                  value={calculatedAge}
                  placeholder="Se calculará automáticamente"
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
                <Label htmlFor="plan-date" style={{ color: colors.text }}>
                  Fecha *
                </Label>
                <Input 
                  id="plan-date" 
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
                placeholder="Describe el diagnóstico según el Certificado Único de Discapacidad..."
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
          </div>

          {/* Datos del Profesional */}
          <div 
            className="p-4 rounded-lg border-l-4 space-y-4"
            style={{ 
              backgroundColor: colors.accent[50],
              borderLeftColor: colors.accent[500]
            }}
          >
            <h3 className="font-medium" style={{ color: colors.text }}>
              Datos del Profesional
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="professional-name" style={{ color: colors.text }}>
                  Profesional (Nombre Completo) *
                </Label>
                <Input 
                  id="professional-name" 
                  placeholder="Ej: Dr. María González López"
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

              <div className="space-y-2">
                <Label htmlFor="period" style={{ color: colors.text }}>
                  Período *
                </Label>
                <Input 
                  id="period" 
                  placeholder="Ej: Primer semestre 2024, Ciclo lectivo 2024, etc."
                  value={formData.period}
                  onChange={(e) => handleInputChange('period', e.target.value)}
                  className={`h-11 ${errors.period ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: errors.period ? colors.error[500] : colors.border,
                    color: colors.text
                  }}
                />
                {errors.period && (
                  <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                    <AlertCircle className="h-4 w-4" />
                    {errors.period}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialty" style={{ color: colors.text }}>
                  Especialidad *
                </Label>
                <Input 
                  id="specialty" 
                  placeholder="Ej: Terapia Ocupacional"
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
                  placeholder="Ej: MP 12345"
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
          </div>

          {/* Plan de Trabajo */}
          <div 
            className="p-4 rounded-lg border-l-4 space-y-4"
            style={{ 
              backgroundColor: colors.secondary[50],
              borderLeftColor: colors.secondary[500]
            }}
          >
            <h3 className="font-medium" style={{ color: colors.text }}>
              Plan de Trabajo
            </h3>

            <div className="space-y-2">
              <Label htmlFor="rationale" style={{ color: colors.text }}>
                Fundamentación *
              </Label>
              <Textarea
                id="rationale"
                placeholder="Describe la fundamentación teórica y práctica del plan de trabajo. Incluye el marco conceptual, metodología y justificación del abordaje propuesto..."
                value={formData.rationale}
                onChange={(e) => handleInputChange('rationale', e.target.value)}
                className={`min-h-[120px] resize-none ${errors.rationale ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: errors.rationale ? colors.error[500] : colors.border,
                  color: colors.text
                }}
              />
              {errors.rationale && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.rationale}
                </div>
              )}
            </div>

            {/* Objetivos Generales */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label style={{ color: colors.text }}>Objetivos Generales *</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addObjective('generalObjectives')}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </Button>
              </div>
              {formData.generalObjectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <Textarea
                      placeholder={`Objetivo general ${index + 1}...`}
                      value={objective}
                      onChange={(e) => handleObjectiveChange('generalObjectives', index, e.target.value)}
                      className="min-h-[80px] resize-none"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text
                      }}
                    />
                  </div>
                  {formData.generalObjectives.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeObjective('generalObjectives', index)}
                      className="mt-0 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {errors.generalObjectives && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.generalObjectives}
                </div>
              )}
            </div>

            {/* Objetivos Específicos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label style={{ color: colors.text }}>Objetivos Específicos *</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addObjective('specificObjectives')}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </Button>
              </div>
              {formData.specificObjectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <Textarea
                      placeholder={`Objetivo específico ${index + 1}...`}
                      value={objective}
                      onChange={(e) => handleObjectiveChange('specificObjectives', index, e.target.value)}
                      className="min-h-[80px] resize-none"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text
                      }}
                    />
                  </div>
                  {formData.specificObjectives.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeObjective('specificObjectives', index)}
                      className="mt-0 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {errors.specificObjectives && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.specificObjectives}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="approach" style={{ color: colors.text }}>
                Modalidad de Abordaje *
              </Label>
              <Textarea
                id="approach"
                placeholder="Describe la modalidad de abordaje terapéutico, metodología, frecuencia de sesiones, duración estimada del tratamiento y estrategias específicas a utilizar..."
                value={formData.approach}
                onChange={(e) => handleInputChange('approach', e.target.value)}
                className={`min-h-[120px] resize-none ${errors.approach ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: errors.approach ? colors.error[500] : colors.border,
                  color: colors.text
                }}
              />
              {errors.approach && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.approach}
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between pt-4 border-t" style={{ borderColor: colors.border }}>
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
                disabled={!formData.patientName || !formData.professionalName}
                style={{
                  borderColor: colors.primary[300],
                  color: colors.primary[600]
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
              Enviar Plan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    {/* Modal de Vista Previa PDF */}
    <PDFPreviewModal
      isOpen={showPDFPreview}
      onClose={() => setShowPDFPreview(false)}
      title="Plan de Trabajo"
      content={pdfContent}
      patientName={formData.patientName}
      professionalName={formData.professionalName}
      date={formData.date}
    />
    </>
  )
}