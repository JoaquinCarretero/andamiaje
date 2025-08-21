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

export function MonthlyReportForm() {
  const [currentSection, setCurrentSection] = useState(1)
  const totalSections = 3
  const progress = (currentSection / totalSections) * 100

  const sections = [
    { id: 1, title: "Actividades Realizadas", icon: TrendingUp },
    { id: 2, title: "Progreso del Estudiante", icon: Target },
    { id: 3, title: "Observaciones", icon: CheckCircle },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-secondary" />
            Reporte Mensual
          </CardTitle>
          <Badge variant="outline">
            Sección {currentSection} de {totalSections}
          </Badge>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {sections.map((section) => (
              <span key={section.id} className={currentSection >= section.id ? "text-secondary font-medium" : ""}>
                {section.title}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Estudiante</p>
            <p className="font-medium">Juan Pérez</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Mes</p>
            <p className="font-medium">Enero 2024</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Sesiones</p>
            <p className="font-medium">12 realizadas</p>
          </div>
        </div>

        {currentSection === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activities-performed">Actividades Realizadas</Label>
              <Textarea
                id="activities-performed"
                placeholder="Describe las actividades de acompañamiento realizadas durante el mes..."
                className="min-h-[120px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="academic-support">Apoyo Académico</Label>
                <Textarea
                  id="academic-support"
                  placeholder="Detalla el apoyo académico brindado..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-support">Apoyo Social</Label>
                <Textarea
                  id="social-support"
                  placeholder="Describe el apoyo en habilidades sociales..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="challenges-faced">Desafíos Enfrentados</Label>
              <Textarea
                id="challenges-faced"
                placeholder="Menciona los principales desafíos del mes..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        )}

        {currentSection === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="academic-progress">Progreso Académico</Label>
              <Textarea
                id="academic-progress"
                placeholder="Evalúa el progreso académico del estudiante..."
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="behavioral-progress">Progreso Comportamental</Label>
              <Textarea
                id="behavioral-progress"
                placeholder="Describe los cambios comportamentales observados..."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social-progress">Progreso Social</Label>
              <Textarea
                id="social-progress"
                placeholder="Evalúa el desarrollo de habilidades sociales..."
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="attendance-rate">Tasa de Asistencia</Label>
                <Input id="attendance-rate" placeholder="Ej: 95%" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participation-level">Nivel de Participación</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="alto">Alto</option>
                  <option value="medio">Medio</option>
                  <option value="bajo">Bajo</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentSection === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="general-observations">Observaciones Generales</Label>
              <Textarea
                id="general-observations"
                placeholder="Comparte observaciones importantes del mes..."
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="family-communication">Comunicación con la Familia</Label>
              <Textarea
                id="family-communication"
                placeholder="Describe la comunicación mantenida con la familia..."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recommendations">Recomendaciones</Label>
              <Textarea
                id="recommendations"
                placeholder="Proporciona recomendaciones para el próximo mes..."
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="next-goals">Objetivos para el Próximo Mes</Label>
                <Textarea
                  id="next-goals"
                  placeholder="Define los objetivos para el siguiente período..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority-areas">Áreas Prioritarias</Label>
                <Textarea
                  id="priority-areas"
                  placeholder="Identifica las áreas que requieren mayor atención..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
            disabled={currentSection === 1}
          >
            Anterior
          </Button>

          <div className="flex gap-2">
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Guardar Borrador
            </Button>

            {currentSection < totalSections ? (
              <Button onClick={() => setCurrentSection(Math.min(totalSections, currentSection + 1))}>
                Siguiente
              </Button>
            ) : (
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Enviar Reporte
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}