"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar, Plus, AlertTriangle, Clock, FileText, Edit, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import colors from "@/lib/colors"

interface CalendarEvent {
  id: string
  title: string
  type: "plan-trabajo" | "informe-inicial" | "informe-semestral" | "reporte-mensual" | "actas" | "facturas"
  priority: "high" | "medium" | "low"
  dueDate: Date
  completed: boolean
  isCustom?: boolean
  description?: string
}

interface CalendarWidgetProps {
  role: "terapeuta" | "acompanante" | "coordinador"
  onNavigate: (view: string) => void
}

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

const getEventsByRole = (role: string): CalendarEvent[] => {
  const baseEvents: CalendarEvent[] = []
  const today = new Date()
  
  if (role === "terapeuta") {
    return [
      {
        id: "1",
        title: "Informe Inicial - María López",
        type: "informe-inicial",
        priority: "high",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        completed: false
      },
      {
        id: "2",
        title: "Plan de Trabajo - Juan Pérez",
        type: "plan-trabajo",
        priority: "medium",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
        completed: false
      },
      {
        id: "3",
        title: "Informe Semestral - Ana García",
        type: "informe-semestral",
        priority: "high",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        completed: false
      },
      {
        id: "4",
        title: "Acta de Reunión",
        type: "actas",
        priority: "medium",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
        completed: false
      },
      {
        id: "5",
        title: "Factura Mensual",
        type: "facturas",
        priority: "high",
        dueDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
        completed: false
      }
    ]
  } else if (role === "acompanante") {
    return [
      {
        id: "1",
        title: "Reporte Mensual - Enero",
        type: "reporte-mensual",
        priority: "high",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
        completed: false
      },
      {
        id: "2",
        title: "Plan de Trabajo - Pedro Rodríguez",
        type: "plan-trabajo",
        priority: "medium",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
        completed: false
      },
      {
        id: "3",
        title: "Factura Mensual",
        type: "facturas",
        priority: "high",
        dueDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
        completed: false
      }
    ]
  } else {
    return [
      {
        id: "1",
        title: "Revisar Reportes Acompañantes",
        type: "reporte-mensual",
        priority: "high",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        completed: false
      },
      {
        id: "2",
        title: "Informe Semestral - Coordinación",
        type: "informe-semestral",
        priority: "medium",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
        completed: false
      },
      {
        id: "3",
        title: "Acta Reunión de Equipo",
        type: "actas",
        priority: "medium",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8),
        completed: false
      }
    ]
  }
}

const getEventColor = (type: string, priority: string) => {
  if (priority === "high") {
    return { bg: colors.error[50], text: colors.error[600], border: colors.error[200] }
  } else if (priority === "medium") {
    return { bg: colors.warning[50], text: colors.warning[600], border: colors.warning[200] }
  } else {
    return { bg: colors.success[50], text: colors.success[600], border: colors.success[200] }
  }
}

export function CalendarWidget({ role, onNavigate }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [newEventForm, setNewEventForm] = useState({
    title: "",
    description: "",
    priority: "medium" as "high" | "medium" | "low"
  })

  useEffect(() => {
    setEvents(getEventsByRole(role))
  }, [role])

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.dueDate)
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear()
    })
  }

  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  const handleEventClick = (event: CalendarEvent) => {
    if (event.isCustom) {
      setEditingEvent(event)
      setNewEventForm({
        title: event.title,
        description: event.description || "",
        priority: event.priority
      })
      setShowEventModal(true)
    } else {
      onNavigate(event.type)
    }
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    const dayEvents = getEventsForDate(date)
    
    if (dayEvents.length === 0) {
      // No hay eventos, mostrar modal para crear uno nuevo
      setEditingEvent(null)
      setNewEventForm({
        title: "",
        description: "",
        priority: "medium"
      })
      setShowEventModal(true)
    }
  }

  const handleSaveEvent = () => {
    if (!selectedDate || !newEventForm.title.trim()) return

    if (editingEvent) {
      // Editar evento existente
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id 
          ? {
              ...event,
              title: newEventForm.title,
              description: newEventForm.description,
              priority: newEventForm.priority
            }
          : event
      ))
    } else {
      // Crear nuevo evento
      const newEvent: CalendarEvent = {
        id: `custom-${Date.now()}`,
        title: newEventForm.title,
        description: newEventForm.description,
        type: "plan-trabajo",
        priority: newEventForm.priority,
        dueDate: selectedDate,
        completed: false,
        isCustom: true
      }
      setEvents(prev => [...prev, newEvent])
    }

    setShowEventModal(false)
    setEditingEvent(null)
    setNewEventForm({ title: "", description: "", priority: "medium" })
  }

  const handleDeleteEvent = () => {
    if (editingEvent) {
      setEvents(prev => prev.filter(event => event.id !== editingEvent.id))
      setShowEventModal(false)
      setEditingEvent(null)
    }
  }

  const upcomingEvents = events
    .filter(event => !event.completed && event.dueDate >= today)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 3)

  // Generar días del calendario
  const calendarDays = []
  
  // Días vacíos del mes anterior
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null)
  }
  
  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day))
  }

  return (
    <div
      className="rounded-xl shadow-soft border"
      style={{ 
        backgroundColor: colors.surface, 
        borderColor: colors.border,
        boxShadow: `0 4px 16px ${colors.shadow}`
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.primary[500] }}
            />
            <h2 
              className="text-lg font-semibold font-display" 
              style={{ color: colors.text }}
            >
              Calendario de Actividades
            </h2>
          </div>
        </div>

        {/* Navegación del calendario */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousMonth}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
            {monthNames[month]} {year}
          </h3>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div
              key={day}
              className="text-center text-xs font-medium py-2"
              style={{ color: colors.textMuted }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendario */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-20" />
            }

            const dayEvents = getEventsForDate(date)
            const hasEvents = dayEvents.length > 0
            const hasHighPriority = dayEvents.some(e => e.priority === "high")
            const displayEvent = dayEvents[0] // Mostrar solo el primer evento

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  h-20 text-xs rounded-lg transition-all duration-200 relative p-2 flex flex-col
                  ${isToday(date) ? 'font-bold ring-2' : ''}
                  ${hasEvents ? 'font-medium' : ''}
                  hover:scale-105 hover:shadow-md
                `}
                style={{
                  backgroundColor: isToday(date) 
                    ? colors.primary[500] 
                    : hasEvents 
                      ? hasHighPriority 
                        ? colors.error[50] 
                        : colors.warning[50]
                      : colors.neutral[50],
                  color: isToday(date) 
                    ? colors.surface 
                    : hasEvents 
                      ? hasHighPriority 
                        ? colors.error[600] 
                        : colors.warning[600]
                      : colors.text,
                  ringColor: isToday(date) ? colors.primary[300] : 'transparent',
                  border: `1px solid ${colors.border}`
                }}
              >
                <div className="font-semibold mb-1">{date.getDate()}</div>
                {displayEvent && (
                  <div className="flex-1 overflow-hidden">
                    <div 
                      className="text-xs leading-tight line-clamp-2 p-1 rounded text-left"
                      style={{
                        backgroundColor: displayEvent.priority === "high" 
                          ? colors.error[100] 
                          : displayEvent.priority === "medium"
                            ? colors.warning[100]
                            : colors.success[100],
                        color: displayEvent.priority === "high" 
                          ? colors.error[700] 
                          : displayEvent.priority === "medium"
                            ? colors.warning[700]
                            : colors.success[700]
                      }}
                    >
                      {displayEvent.title}
                    </div>
                  </div>
                )}
                {hasEvents && (
                  <div
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: hasHighPriority ? colors.error[500] : colors.warning[500]
                    }}
                  />
                )}
                {dayEvents.length > 1 && (
                  <div 
                    className="absolute bottom-1 right-1 text-xs px-1 rounded-full"
                    style={{
                      backgroundColor: colors.primary[500],
                      color: colors.surface
                    }}
                  >
                    +{dayEvents.length - 1}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Próximas actividades */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium" style={{ color: colors.text }}>
            Próximas Actividades
          </h4>
          
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-4">
              <Calendar className="h-8 w-8 mx-auto mb-2" style={{ color: colors.textMuted }} />
              <p className="text-xs" style={{ color: colors.textMuted }}>
                No hay actividades pendientes
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map((event) => {
                const eventColors = getEventColor(event.type, event.priority)
                const daysUntil = Math.ceil((event.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                
                return (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="w-full p-2 rounded-lg border transition-all duration-200 hover:shadow-sm hover:scale-[1.02] text-left"
                    style={{
                      backgroundColor: eventColors.bg,
                      borderColor: eventColors.border
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: eventColors.text }}>
                          {event.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" style={{ color: colors.textMuted }} />
                          <span className="text-xs" style={{ color: colors.textMuted }}>
                            {daysUntil === 0 ? 'Hoy' : daysUntil === 1 ? 'Mañana' : `En ${daysUntil} días`}
                          </span>
                          {event.priority === "high" && (
                            <Badge
                              className="text-xs px-1 py-0"
                              style={{
                                backgroundColor: colors.error[500],
                                color: colors.surface
                              }}
                            >
                              Urgente
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar eventos */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEventModal(false)}
          />
          
          <Card 
            className="relative w-full max-w-md border-0 shadow-2xl"
            style={{ 
              backgroundColor: colors.surface,
              boxShadow: `0 25px 50px ${colors.shadowLarge}`
            }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" style={{ color: colors.primary[500] }} />
                  <span style={{ color: colors.text }}>
                    {editingEvent ? 'Editar Actividad' : 'Nueva Actividad'}
                  </span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEventModal(false)}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event-title" style={{ color: colors.text }}>
                  Título *
                </Label>
                <Input
                  id="event-title"
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título de la actividad"
                  className="h-11"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text
                  }}
              <div className="space-y-2">
                <Label htmlFor="event-description" style={{ color: colors.text }}>
                  Descripción
                </Label>
                <Textarea
                  id="event-description"
                  value={newEventForm.description}
                  onChange={(e) => setNewEventForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción detallada de la actividad"
                  className="min-h-[80px] resize-none"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
              </div>
                />
              <div className="space-y-2">
                <Label htmlFor="event-priority" style={{ color: colors.text }}>
                  Prioridad
                </Label>
                <select
                  id="event-priority"
                  value={newEventForm.priority}
                  onChange={(e) => setNewEventForm(prev => ({ ...prev, priority: e.target.value as "high" | "medium" | "low" }))}
                  className="flex h-11 w-full rounded-md border px-3 py-2 text-sm"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              </div>
              <div className="flex justify-between pt-4 border-t" style={{ borderColor: colors.border }}>
                {editingEvent && (
                  <Button
                    variant="outline"
                    onClick={handleDeleteEvent}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                )}
                
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="outline"
                    onClick={() => setShowEventModal(false)}
                    style={{
                      borderColor: colors.border,
                      color: colors.textSecondary
                    }}
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    onClick={handleSaveEvent}
                    disabled={!newEventForm.title.trim()}
                    style={{
                      backgroundColor: colors.primary[500],
                      color: colors.surface
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingEvent ? 'Guardar' : 'Crear'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}