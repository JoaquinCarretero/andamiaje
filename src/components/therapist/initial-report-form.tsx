"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Save, Send, User, Calendar, Stethoscope, ClipboardList } from "lucide-react"
import colors from "@/lib/colors"

export function InitialReportForm() {
  const [currentSection, setCurrentSection] = useState(1)
  const totalSections = 3
  const progress = (currentSection / totalSections) * 100

  const sections = [
    { id: 1, title: "Datos del Paciente", icon: User },
    { id: 2, title: "Información Clínica", icon: Stethoscope },
    { id: 3, title: "Evaluación Inicial", icon: ClipboardList },
  ]

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

  const [birthDate, setBirthDate] = useState("")
  const [calculatedAge, setCalculatedAge] = useState("")

  const handleBirthDateChange = (date: string) => {
    setBirthDate(date)
    setCalculatedAge(calculateAge(date))
  }

  return (
    <Card 
      className="w-full shadow-soft border-0"
      style={{ 
        backgroundColor: colors.surface,
        borderColor: colors.border 
      }}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" style={{ color: colors.primary[500] }} />
            <span style={{ color: colors.text }}>Informe Inicial</span>
          </CardTitle>
          <Badge 
            variant="outline"
            style={{ 
              backgroundColor: colors.primary[50], 
              color: colors.primary[700],
              borderColor: colors.primary[200]
            }}
          >
            Sección {currentSection} de {totalSections}
          </Badge>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {sections.map((section) => (
              <span 
                key={section.id} 
                className={currentSection >= section.id ? "font-medium" : ""}
                style={{ 
                  color: currentSection >= section.id ? colors.primary[500] : colors.textMuted 
                }}
              >
                {section.title}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentSection === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient-full-name" style={{ color: colors.text }}>
                Paciente (Nombre Completo)
              </Label>
              <Input 
                id="patient-full-name" 
                placeholder="Ej: Juan Carlos Pérez González"
                className="h-11"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-dni" style={{ color: colors.text }}>
                  DNI (Número)
                </Label>
                <Input 
                  id="patient-dni" 
                  type="text"
                  placeholder="Ej: 12345678"
                  className="h-11"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-birth-date" style={{ color: colors.text }}>
                  Fecha de Nacimiento
                </Label>
                <Input 
                  id="patient-birth-date" 
                  type="date"
                  value={birthDate}
                  onChange={(e) => handleBirthDateChange(e.target.value)}
                  className="h-11"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-age" style={{ color: colors.text }}>
                  Edad (en años y meses si tiene menos de 10 años)
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
                <Label htmlFor="report-date" style={{ color: colors.text }}>
                  Fecha del Informe
                </Label>
                <Input 
                  id="report-date" 
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
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
                Diagnóstico (según CUD)
              </Label>
              <Textarea
                id="diagnosis-cud"
                placeholder="Describe el diagnóstico según el Certificado Único de Discapacidad..."
                className="min-h-[100px] resize-none"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
              <p className="text-xs" style={{ color: colors.textMuted }}>
                Incluye toda la información relevante del CUD del paciente
              </p>
            </div>
          </div>
        )}

        {currentSection === 2 && (
          <div className="space-y-4">
            <div 
              className="p-4 rounded-lg border-l-4"
              style={{ 
                backgroundColor: colors.primary[50],
                borderLeftColor: colors.primary[500]
              }}
            >
              <h3 className="font-medium mb-2" style={{ color: colors.text }}>
                Información del Paciente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span style={{ color: colors.textMuted }}>Paciente:</span>
                  <span className="ml-2 font-medium" style={{ color: colors.text }}>
                    Juan Carlos Pérez González
                  </span>
                </div>
                <div>
                  <span style={{ color: colors.textMuted }}>Edad:</span>
                  <span className="ml-2 font-medium" style={{ color: colors.text }}>
                    {calculatedAge || "Por calcular"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="introduction" style={{ color: colors.text }}>
                Introducción
              </Label>
              <Textarea
                id="introduction"
                placeholder="Describe el motivo de consulta, antecedentes relevantes y contexto del paciente. Incluye información sobre el entorno familiar, escolar y social que consideres importante para el tratamiento..."
                className="min-h-[140px] resize-none"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
              <p className="text-xs" style={{ color: colors.textMuted }}>
                Proporciona un contexto completo sobre la situación del paciente
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="characterization" style={{ color: colors.text }}>
                Caracterización
              </Label>
              <Textarea
                id="characterization"
                placeholder="Describe las características principales del paciente: fortalezas, dificultades, patrones de comportamiento, habilidades desarrolladas, áreas de oportunidad, estilo de aprendizaje, intereses y motivaciones..."
                className="min-h-[140px] resize-none"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
              <p className="text-xs" style={{ color: colors.textMuted }}>
                Incluye una descripción detallada del perfil del paciente
              </p>
            </div>
          </div>
        )}

        {currentSection === 3 && (
          <div className="space-y-4">
            <div 
              className="p-4 rounded-lg border-l-4"
              style={{ 
                backgroundColor: colors.success[50],
                borderLeftColor: colors.success[500]
              }}
            >
              <h3 className="font-medium mb-2" style={{ color: colors.text }}>
                Resumen del Informe
              </h3>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                Revisa toda la información antes de enviar el informe inicial
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial-observations" style={{ color: colors.text }}>
                Observaciones Iniciales
              </Label>
              <Textarea
                id="initial-observations"
                placeholder="Registra las primeras observaciones del paciente durante la evaluación inicial. Incluye comportamientos observados, respuestas a estímulos, nivel de atención, comunicación y cualquier aspecto relevante..."
                className="min-h-[120px] resize-none"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial-recommendations" style={{ color: colors.text }}>
                Recomendaciones Preliminares
              </Label>
              <Textarea
                id="initial-recommendations"
                placeholder="Proporciona recomendaciones iniciales basadas en la evaluación. Incluye sugerencias para el tratamiento, frecuencia de sesiones, objetivos preliminares y cualquier consideración especial..."
                className="min-h-[120px] resize-none"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="next-evaluation" style={{ color: colors.text }}>
                  Próxima Evaluación
                </Label>
                <Input 
                  id="next-evaluation" 
                  type="date"
                  className="h-11"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsible-therapist" style={{ color: colors.text }}>
                  Terapeuta Responsable
                </Label>
                <Input 
                  id="responsible-therapist" 
                  placeholder="Dr. María González" 
                  className="h-11"
                  style={{
                    backgroundColor: colors.neutral[50],
                    borderColor: colors.border,
                    color: colors.textMuted
                  }}
                  disabled 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional-notes" style={{ color: colors.text }}>
                Notas Adicionales
              </Label>
              <Textarea
                id="additional-notes"
                placeholder="Agrega cualquier información adicional que consideres relevante para el caso..."
                className="min-h-[80px] resize-none"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t" style={{ borderColor: colors.border }}>
          <Button
            variant="outline"
            onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
            disabled={currentSection === 1}
            style={{
              borderColor: colors.border,
              color: colors.textSecondary
            }}
          >
            Anterior
          </Button>

          <div className="flex gap-2">
            <Button 
              variant="outline"
              style={{
                borderColor: colors.border,
                color: colors.textSecondary
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Borrador
            </Button>

            {currentSection < totalSections ? (
              <Button
                onClick={() => setCurrentSection(Math.min(totalSections, currentSection + 1))}
                style={{
                  backgroundColor: colors.primary[500],
                  color: colors.surface
                }}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                style={{
                  backgroundColor: colors.primary[500],
                  color: colors.surface
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Informe
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}