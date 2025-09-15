"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar, Plus, AlertTriangle, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    onNavigate(event.type)
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
        <div className="grid grid-cols-7 gap-1 mb-6">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-8" />
            }

            const dayEvents = getEventsForDate(date)
            const hasEvents = dayEvents.length > 0
            const hasHighPriority = dayEvents.some(e => e.priority === "high")

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`
                  h-8 text-xs rounded-md transition-all duration-200 relative
                  ${isToday(date) ? 'font-bold ring-2' : ''}
                  ${hasEvents ? 'font-medium' : ''}
                  hover:scale-110 hover:shadow-sm
                `}
                style={{
                  backgroundColor: isToday(date) 
                    ? colors.primary[500] 
                    : hasEvents 
                      ? hasHighPriority 
                        ? colors.error[50] 
                        : colors.warning[50]
                      : 'transparent',
                  color: isToday(date) 
                    ? colors.surface 
                    : hasEvents 
                      ? hasHighPriority 
                        ? colors.error[600] 
                        : colors.warning[600]
                      : colors.text,
                  ringColor: isToday(date) ? colors.primary[300] : 'transparent'
                }}
              >
                {date.getDate()}
                {hasEvents && (
                  <div
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: hasHighPriority ? colors.error[500] : colors.warning[500]
                    }}
                  />
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
    </div>
  )
}