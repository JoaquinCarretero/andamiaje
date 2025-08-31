"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Save, Send, User, Target, Activity, CheckCircle } from "lucide-react"
import colors from "@/lib/colors"

export function WorkPlanForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const steps = [
    { id: 1, title: "Datos del Paciente", icon: User },
    { id: 2, title: "Objetivos", icon: Target },
    { id: 3, title: "Actividades", icon: Activity },
    { id: 4, title: "Evaluación", icon: CheckCircle },
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
            <FileText className="h-5 w-5" style={{ color: colors.primary[500] }} />
            <span style={{ color: colors.text }}>Plan de Trabajo</span>
          </CardTitle>
          <Badge 
            variant="secondary"
            style={{ 
              backgroundColor: colors.primary[50], 
              color: colors.primary[700] 
            }}
          >
            Paso {currentStep} de {totalSteps}
          </Badge>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {steps.map((step) => (
              <span 
                key={step.id} 
                className={currentStep >= step.id ? "font-medium" : ""}
                style={{ 
                  color: currentStep >= step.id ? colors.primary[500] : colors.textMuted 
                }}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-name" style={{ color: colors.text }}>
                  Nombre del Paciente
                </Label>
                <Input 
                  id="patient-name" 
                  placeholder="Ej: Juan Pérez"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-age" style={{ color: colors.text }}>
                  Edad
                </Label>
                <Input 
                  id="patient-age" 
                  type="number" 
                  placeholder="Ej: 8"
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
                <Label htmlFor="diagnosis">Diagnóstico</Label>
                <Input id="diagnosis" placeholder="Ej: TEA, TDAH, etc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">Fecha de Inicio</Label>
                <Input id="start-date" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="background">Antecedentes Relevantes</Label>
              <Textarea
                id="background"
                placeholder="Describe los antecedentes médicos y educativos relevantes..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="general-objective">Objetivo General</Label>
              <Textarea
                id="general-objective"
                placeholder="Describe el objetivo principal del tratamiento..."
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specific-objectives">Objetivos Específicos</Label>
              <Textarea
                id="specific-objectives"
                placeholder="Lista los objetivos específicos a alcanzar..."
                className="min-h-[120px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duración Estimada</Label>
                <Input id="duration" placeholder="Ej: 6 meses" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frecuencia de Sesiones</Label>
                <Input id="frequency" placeholder="Ej: 2 veces por semana" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activities">Actividades Terapéuticas</Label>
              <Textarea
                id="activities"
                placeholder="Describe las actividades y ejercicios a realizar..."
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="materials">Materiales Necesarios</Label>
              <Textarea
                id="materials"
                placeholder="Lista los materiales y recursos necesarios..."
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="methodology">Metodología</Label>
              <Textarea
                id="methodology"
                placeholder="Explica la metodología y enfoque terapéutico..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="evaluation-criteria">Criterios de Evaluación</Label>
              <Textarea
                id="evaluation-criteria"
                placeholder="Define cómo se evaluará el progreso..."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="indicators">Indicadores de Éxito</Label>
              <Textarea
                id="indicators"
                placeholder="Lista los indicadores que mostrarán el éxito del tratamiento..."
                className="min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="review-date">Fecha de Revisión</Label>
                <Input id="review-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsible">Terapeuta Responsable</Label>
                <Input id="responsible" placeholder="Dr. María González" disabled />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
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

            {currentStep < totalSteps ? (
              <Button 
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
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
                Enviar Plan
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
