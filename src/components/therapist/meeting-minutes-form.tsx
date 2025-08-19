"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, Save, Send, Plus, Trash2, Clock } from "lucide-react"

export function MeetingMinutesForm() {
  const [attendees, setAttendees] = useState([""])
  const [agreements, setAgreements] = useState([""])

  const addAttendee = () => {
    setAttendees([...attendees, ""])
  }

  const removeAttendee = (index: number) => {
    setAttendees(attendees.filter((_, i) => i !== index))
  }

  const updateAttendee = (index: number, value: string) => {
    const newAttendees = [...attendees]
    newAttendees[index] = value
    setAttendees(newAttendees)
  }

  const addAgreement = () => {
    setAgreements([...agreements, ""])
  }

  const removeAgreement = (index: number) => {
    setAgreements(agreements.filter((_, i) => i !== index))
  }

  const updateAgreement = (index: number, value: string) => {
    const newAgreements = [...agreements]
    newAgreements[index] = value
    setAgreements(newAgreements)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Acta de Reunión
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            En progreso
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-date">Fecha de la Reunión</Label>
            <Input id="meeting-date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-time">Hora</Label>
            <Input id="meeting-time" type="time" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-type">Tipo de Reunión</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Seleccionar tipo</option>
              <option value="seguimiento">Seguimiento de caso</option>
              <option value="evaluacion">Evaluación inicial</option>
              <option value="revision">Revisión de plan</option>
              <option value="coordinacion">Coordinación interdisciplinaria</option>
              <option value="familia">Reunión con familia</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-case">Caso del Paciente</Label>
            <Input id="patient-case" placeholder="Ej: Juan Pérez - TEA" />
          </div>
        </div>

        {/* Asistentes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Asistentes</Label>
            <Button type="button" variant="outline" size="sm" onClick={addAttendee}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
          {attendees.map((attendee, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Nombre y cargo del asistente"
                value={attendee}
                onChange={(e) => updateAttendee(index, e.target.value)}
              />
              {attendees.length > 1 && (
                <Button type="button" variant="outline" size="icon" onClick={() => removeAttendee(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Temas tratados */}
        <div className="space-y-2">
          <Label htmlFor="topics-discussed">Temas Tratados</Label>
          <Textarea
            id="topics-discussed"
            placeholder="Describe los principales temas discutidos en la reunión..."
            className="min-h-[120px]"
          />
        </div>

        {/* Observaciones */}
        <div className="space-y-2">
          <Label htmlFor="observations">Observaciones y Comentarios</Label>
          <Textarea
            id="observations"
            placeholder="Registra observaciones importantes, comentarios de los asistentes..."
            className="min-h-[100px]"
          />
        </div>

        {/* Acuerdos y compromisos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Acuerdos y Compromisos</Label>
            <Button type="button" variant="outline" size="sm" onClick={addAgreement}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
          {agreements.map((agreement, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                placeholder="Describe el acuerdo o compromiso establecido..."
                value={agreement}
                onChange={(e) => updateAgreement(index, e.target.value)}
                className="min-h-[60px]"
              />
              {agreements.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeAgreement(index)}
                  className="mt-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Próximos pasos */}
        <div className="space-y-2">
          <Label htmlFor="next-steps">Próximos Pasos</Label>
          <Textarea
            id="next-steps"
            placeholder="Define las acciones a seguir después de esta reunión..."
            className="min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="next-meeting">Próxima Reunión</Label>
            <Input id="next-meeting" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsible">Responsable del Acta</Label>
            <Input id="responsible" placeholder="Dr. María González" disabled />
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Guardar Borrador
          </Button>

          <Button>
            <Send className="h-4 w-4 mr-2" />
            Finalizar Acta
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
