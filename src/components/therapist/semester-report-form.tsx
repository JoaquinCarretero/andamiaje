"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Save, Send, TrendingUp, Target, CheckCircle } from "lucide-react"
import colors from "@/lib/colors"

export function SemesterReportForm() {
  const [currentSection, setCurrentSection] = useState(1)
  const totalSections = 3
  const progress = (currentSection / totalSections) * 100

  const sections = [
    { id: 1, title: "Progreso General", icon: TrendingUp },
    { id: 2, title: "Objetivos Alcanzados", icon: Target },
    { id: 3, title: "Recomendaciones", icon: CheckCircle },
  ]

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
            <Calendar className="h-5 w-5" style={{ color: colors.secondary[500] }} />
            <span style={{ color: colors.text }}>Informe Semestral</span>
          </CardTitle>
          <Badge 
            variant="outline"
            style={{ 
              backgroundColor: colors.secondary[50], 
              color: colors.secondary[700],
              borderColor: colors.secondary[200]
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
                  color: currentSection >= section.id ? colors.secondary[500] : colors.textMuted 
                }}
              >
                {section.title}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg"
          style={{ backgroundColor: colors.neutral[50] }}
        >
          <div className="text-center">
            <p className="text-sm" style={{ color: colors.textMuted }}>Paciente</p>
            <p className="font-medium" style={{ color: colors.text }}>Juan Pérez</p>
          </div>
          <div className="text-center">
            <p className="text-sm" style={{ color: colors.textMuted }}>Período</p>
            <p className="font-medium" style={{ color: colors.text }}>Ene - Jun 2024</p>
          </div>
          <div className="text-center">
            <p className="text-sm" style={{ color: colors.textMuted }}>Sesiones</p>
            <p className="font-medium" style={{ color: colors.text }}>24 realizadas</p>
          </div>
        </div>

        {currentSection === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="general-progress">Progreso General del Paciente</Label>
              <Textarea
                id="general-progress"
                placeholder="Describe el progreso general observado durante el semestre..."
                className="min-h-[120px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="strengths">Fortalezas Identificadas</Label>
                <Textarea
                  id="strengths"
                  placeholder="Lista las principales fortalezas del paciente..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="challenges">Desafíos Encontrados</Label>
                <Textarea
                  id="challenges"
                  placeholder="Describe los principales desafíos y dificultades..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="behavioral-changes">Cambios Comportamentales</Label>
              <Textarea
                id="behavioral-changes"
                placeholder="Detalla los cambios comportamentales observados..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        )}

        {currentSection === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="achieved-objectives">Objetivos Alcanzados</Label>
              <Textarea
                id="achieved-objectives"
                placeholder="Lista los objetivos que se han alcanzado completamente..."
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partial-objectives">Objetivos en Progreso</Label>
              <Textarea
                id="partial-objectives"
                placeholder="Describe los objetivos que están en proceso de alcanzarse..."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pending-objectives">Objetivos Pendientes</Label>
              <Textarea
                id="pending-objectives"
                placeholder="Lista los objetivos que aún no se han iniciado o requieren más trabajo..."
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="success-percentage">Porcentaje de Éxito</Label>
                <Input id="success-percentage" type="number" placeholder="Ej: 75" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-attendance">Asistencia a Sesiones</Label>
                <Input id="session-attendance" placeholder="Ej: 22/24 sesiones" />
              </div>
            </div>
          </div>
        )}

        {currentSection === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="future-recommendations">Recomendaciones para el Próximo Período</Label>
              <Textarea
                id="future-recommendations"
                placeholder="Proporciona recomendaciones específicas para continuar el tratamiento..."
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="family-recommendations">Recomendaciones para la Familia</Label>
              <Textarea
                id="family-recommendations"
                placeholder="Sugiere actividades y estrategias para que la familia apoye en casa..."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school-recommendations">Recomendaciones para la Escuela</Label>
              <Textarea
                id="school-recommendations"
                placeholder="Proporciona sugerencias para el entorno escolar..."
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="next-review">Próxima Revisión</Label>
                <Input id="next-review" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority-level">Nivel de Prioridad</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
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
                  backgroundColor: colors.secondary[500],
                  color: colors.surface
                }}
              >
            ) : (
              <Button
                style={{
                  backgroundColor: colors.secondary[500],
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
