"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Save, Send, AlertCircle, Eye } from "lucide-react"
import { PDFPreviewModal } from "@/components/ui/pdf-preview-modal"
import { useSignature } from "@/lib/signature-storage"
import colors from "@/lib/colors"

export function MonthlyReportForm() {
  const { getSignature } = useSignature()
  const [showPDFPreview, setShowPDFPreview] = useState(false)
  const [formData, setFormData] = useState({
    studentName: "",
    month: "",
    sessionsCompleted: "",
    activitiesPerformed: "",
    challengesFaced: "",
    academicSupport: "",
    socialSupport: "",
    academicProgress: "",
    behavioralProgress: "",
    socialProgress: "",
    attendanceRate: "",
    participationLevel: "",
    generalObservations: "",
    familyCommunication: "",
    recommendations: "",
    nextGoals: "",
    priorityAreas: ""
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

    if (!formData.studentName.trim()) {
      newErrors.studentName = "El nombre del estudiante es obligatorio"
    }

    if (!formData.month.trim()) {
      newErrors.month = "El mes es obligatorio"
    }

    if (!formData.activitiesPerformed.trim()) {
      newErrors.activitiesPerformed = "Las actividades realizadas son obligatorias"
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
        <h3 className="text-lg font-semibold mb-4">Información del Reporte</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Estudiante:</strong> {formData.studentName}</div>
          <div><strong>Mes:</strong> {formData.month}</div>
          <div><strong>Sesiones Realizadas:</strong> {formData.sessionsCompleted}</div>
          <div><strong>Acompañante:</strong> Prof. Ana Martínez</div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Actividades Realizadas</h3>
        <p>{formData.activitiesPerformed}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Progreso del Estudiante</h3>
        <p>{formData.academicProgress}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Observaciones</h3>
        <p>{formData.generalObservations}</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Layout horizontal optimizado - 3 columnas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Información General */}
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
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student-name" style={{ color: colors.text }}>
                Estudiante *
              </Label>
              <Input 
                id="student-name" 
                placeholder="Nombre del estudiante"
                value={formData.studentName}
                onChange={(e) => handleInputChange('studentName', e.target.value)}
                className={`h-11 ${errors.studentName ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: errors.studentName ? colors.error[500] : colors.border,
                  color: colors.text
                }}
              />
              {errors.studentName && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.studentName}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="month" style={{ color: colors.text }}>
                  Mes *
                </Label>
                <Input 
                  id="month" 
                  placeholder="Enero 2024"
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                  className={`h-11 ${errors.month ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: errors.month ? colors.error[500] : colors.border,
                    color: colors.text
                  }}
                />
                {errors.month && (
                  <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                    <AlertCircle className="h-4 w-4" />
                    {errors.month}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessions-completed" style={{ color: colors.text }}>
                  Sesiones
                </Label>
                <Input 
                  id="sessions-completed" 
                  placeholder="12"
                  value={formData.sessionsCompleted}
                  onChange={(e) => handleInputChange('sessionsCompleted', e.target.value)}
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
              <Label htmlFor="activities-performed" style={{ color: colors.text }}>
                Actividades Realizadas *
              </Label>
              <Textarea
                id="activities-performed"
                placeholder="Describe las actividades de acompañamiento realizadas durante el mes..."
                value={formData.activitiesPerformed}
                onChange={(e) => handleInputChange('activitiesPerformed', e.target.value)}
                className={`min-h-[120px] resize-none ${errors.activitiesPerformed ? 'border-red-500' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: errors.activitiesPerformed ? colors.error[500] : colors.border,
                  color: colors.text
                }}
              />
              {errors.activitiesPerformed && (
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.activitiesPerformed}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenges-faced" style={{ color: colors.text }}>
                Desafíos Enfrentados
              </Label>
              <Textarea
                id="challenges-faced"
                placeholder="Menciona los principales desafíos del mes..."
                value={formData.challengesFaced}
                onChange={(e) => handleInputChange('challengesFaced', e.target.value)}
                className="min-h-[100px] resize-none"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Progreso del Estudiante */}
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
              Progreso del Estudiante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="academic-progress" style={{ color: colors.text }}>
                Progreso Académico
              </Label>
              <Textarea
                id="academic-progress"
                placeholder="Evalúa el progreso académico del estudiante..."
                value={formData.academicProgress}
                onChange={(e) => handleInputChange('academicProgress', e.target.value)}
                className="min-h-[100px] resize-none"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="behavioral-progress" style={{ color: colors.text }}>
                Progreso Comportamental
              </Label>
              <Textarea
                id="behavioral-progress"
                placeholder="Describe los cambios comportamentales observados..."
                value={formData.behavioralProgress}
                onChange={(e) => handleInputChange('behavioralProgress', e.target.value)}
                className="min-h-[100px] resize-none"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social-progress" style={{ color: colors.text }}>
                Progreso Social
              </Label>
              <Textarea
                id="social-progress"
                placeholder="Evalúa el desarrollo de habilidades sociales..."
                value={formData.socialProgress}
                onChange={(e) => handleInputChange('socialProgress', e.target.value)}
                className="min-h-[100px] resize-none"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="attendance-rate" style={{ color: colors.text }}>
                  Tasa de Asistencia
                </Label>
                <Input 
                  id="attendance-rate" 
                  placeholder="Ej: 95%"
                  value={formData.attendanceRate}
                  onChange={(e) => handleInputChange('attendanceRate', e.target.value)}
                  className="h-11"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participation-level" style={{ color: colors.text }}>
                  Nivel de Participación
                </Label>
                <select 
                  id="participation-level"
                  value={formData.participationLevel}
                  onChange={(e) => handleInputChange('participationLevel', e.target.value)}
                  className="flex h-11 w-full rounded-md border px-3 py-2 text-sm"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                >
                  <option value="">Seleccionar</option>
                  <option value="alto">Alto</option>
                  <option value="medio">Medio</option>
                  <option value="bajo">Bajo</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observaciones y Recomendaciones */}
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
              Observaciones y Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="general-observations" style={{ color: colors.text }}>
                Observaciones Generales
              </Label>
              <Textarea
                id="general-observations"
                placeholder="Comparte observaciones importantes del mes..."
                value={formData.generalObservations}
                onChange={(e) => handleInputChange('generalObservations', e.target.value)}
                className="min-h-[100px] resize-none"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="family-communication" style={{ color: colors.text }}>
                Comunicación con la Familia
              </Label>
              <Textarea
                id="family-communication"
                placeholder="Describe la comunicación mantenida con la familia..."
                value={formData.familyCommunication}
                onChange={(e) => handleInputChange('familyCommunication', e.target.value)}
                className="min-h-[100px] resize-none"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommendations" style={{ color: colors.text }}>
                Recomendaciones
              </Label>
              <Textarea
                id="recommendations"
                placeholder="Proporciona recomendaciones para el próximo mes..."
                value={formData.recommendations}
                onChange={(e) => handleInputChange('recommendations', e.target.value)}
                className="min-h-[80px] resize-none"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next-goals" style={{ color: colors.text }}>
                Objetivos para el Próximo Mes
              </Label>
              <Textarea
                id="next-goals"
                placeholder="Define los objetivos para el siguiente período..."
                value={formData.nextGoals}
                onChange={(e) => handleInputChange('nextGoals', e.target.value)}
                className="min-h-[80px] resize-none"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
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
                  disabled={!formData.studentName}
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
                  backgroundColor: colors.secondary[500],
                  color: colors.surface
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Reporte
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <PDFPreviewModal
        isOpen={showPDFPreview}
        onClose={() => setShowPDFPreview(false)}
        title="Reporte Mensual"
        content={pdfContent}
        patientName={formData.studentName}
        professionalName="Prof. Ana Martínez"
        date={formData.month}
      />
    </>
  )
}