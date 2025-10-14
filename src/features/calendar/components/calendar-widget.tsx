"use client";

import { useReducer, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  CreditCard as Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  useConfirmation,
} from "@/ui";
import colors from "@/lib/colors";

type CalendarEventType =
  | "plan-trabajo"
  | "informe-inicial"
  | "informe-semestral"
  | "reporte-mensual"
  | "actas"
  | "facturas";

interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType | string;
  priority: "high" | "medium" | "low";
  dueDate: Date;
  completed: boolean;
  isCustom?: boolean;
  description?: string;
}

interface CalendarWidgetProps {
  role: "terapeuta" | "acompanante" | "coordinador";
  onNavigate: (view: string) => void;
}

// ✅ Definición del estado
type CalendarState = {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  showEventModal: boolean;
  showEventDetailModal: boolean;
  selectedEvent: CalendarEvent | null;
  editingEvent: CalendarEvent | null;
  newEventForm: {
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  };
};

// ✅ Definición de acciones
type CalendarAction =
  | { type: "SET_CURRENT_DATE"; payload: Date }
  | { type: "SET_EVENTS"; payload: CalendarEvent[] }
  | { type: "ADD_EVENT"; payload: CalendarEvent }
  | { type: "UPDATE_EVENT"; payload: { id: string; updates: Partial<CalendarEvent> } }
  | { type: "DELETE_EVENT"; payload: string }
  | { type: "SELECT_DATE"; payload: Date | null }
  | { type: "SELECT_EVENT"; payload: CalendarEvent | null }
  | { type: "SET_EDITING_EVENT"; payload: CalendarEvent | null }
  | { type: "TOGGLE_EVENT_MODAL"; payload: boolean }
  | { type: "TOGGLE_EVENT_DETAIL_MODAL"; payload: boolean }
  | { type: "UPDATE_EVENT_FORM"; payload: Partial<CalendarState["newEventForm"]> }
  | { type: "RESET_EVENT_FORM" }
  | { type: "PREVIOUS_MONTH" }
  | { type: "NEXT_MONTH" };

// ✅ Reducer unificado
const calendarReducer = (state: CalendarState, action: CalendarAction): CalendarState => {
  switch (action.type) {
    case "SET_CURRENT_DATE":
      return { ...state, currentDate: action.payload };

    case "SET_EVENTS":
      return { ...state, events: action.payload };

    case "ADD_EVENT":
      return { ...state, events: [...state.events, action.payload] };

    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? { ...event, ...action.payload.updates } : event
        ),
      };

    case "DELETE_EVENT":
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };

    case "SELECT_DATE":
      return { ...state, selectedDate: action.payload };

    case "SELECT_EVENT":
      return { ...state, selectedEvent: action.payload };

    case "SET_EDITING_EVENT":
      return { ...state, editingEvent: action.payload };

    case "TOGGLE_EVENT_MODAL":
      return { ...state, showEventModal: action.payload };

    case "TOGGLE_EVENT_DETAIL_MODAL":
      return { ...state, showEventDetailModal: action.payload };

    case "UPDATE_EVENT_FORM":
      return {
        ...state,
        newEventForm: { ...state.newEventForm, ...action.payload },
      };

    case "RESET_EVENT_FORM":
      return {
        ...state,
        newEventForm: { title: "", description: "", priority: "medium" },
      };

    case "PREVIOUS_MONTH":
      return {
        ...state,
        currentDate: new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() - 1, 1),
      };

    case "NEXT_MONTH":
      return {
        ...state,
        currentDate: new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 1),
      };

    default:
      return state;
  }
};

// ✅ Estado inicial
const getInitialState = (): CalendarState => ({
  currentDate: new Date(),
  events: [],
  selectedDate: null,
  showEventModal: false,
  showEventDetailModal: false,
  selectedEvent: null,
  editingEvent: null,
  newEventForm: {
    title: "",
    description: "",
    priority: "medium",
  },
});

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const getEventsByRole = (role: string): CalendarEvent[] => {
  const today = new Date();

  if (role === "terapeuta") {
    return [
      {
        id: "1",
        title: "Informe Inicial - Paciente A",
        type: "informe-inicial",
        priority: "high",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        completed: false,
      },
      {
        id: "2",
        title: "Plan de Trabajo - Paciente B",
        type: "plan-trabajo",
        priority: "medium",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
        completed: false,
      },
      {
        id: "3",
        title: "Informe Semestral - Paciente C",
        type: "informe-semestral",
        priority: "high",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        completed: false,
      },
      {
        id: "4",
        title: "Acta de Reunión",
        type: "actas",
        priority: "medium",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
        completed: false,
      },
    ];
  } else if (role === "acompanante") {
    return [
      {
        id: "1",
        title: "Reporte Mensual - Estudiante X",
        type: "reporte-mensual",
        priority: "high",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
        completed: false,
      },
      {
        id: "2",
        title: "Plan de Trabajo - Estudiante Y",
        type: "plan-trabajo",
        priority: "medium",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
        completed: false,
      },
    ];
  } else {
    return [
      {
        id: "1",
        title: "Reporte Mensual - Seguimiento",
        type: "reporte-mensual",
        priority: "high",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        completed: false,
      },
      {
        id: "2",
        title: "Informe Semestral - Revisión",
        type: "informe-semestral",
        priority: "medium",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
        completed: false,
      },
      {
        id: "3",
        title: "Acta de Coordinación",
        type: "actas",
        priority: "medium",
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8),
        completed: false,
      },
    ];
  }
};

const getEventColor = (
  type: string,
  priority: "high" | "medium" | "low"
): { bg: string; text: string; border: string } => {
  if (priority === "high") {
    return {
      bg: colors.error[50],
      text: colors.error[600],
      border: colors.error[200],
    };
  }
  if (priority === "low") {
    return {
      bg: colors.warning[50],
      text: colors.warning[600],
      border: colors.warning[200],
    };
  }
  return {
    bg: colors.success[50],
    text: colors.success[600],
    border: colors.success[200],
  };
};

/**
 * ✅ CalendarWidget refactorizado con useReducer
 * - Estado unificado
 * - Sin riesgo de hooks en loops
 * - Lógica centralizada
 * - Más fácil de testear
 */
export function CalendarWidget({ role, onNavigate }: CalendarWidgetProps) {
  // ✅ useReducer en lugar de múltiples useState
  const [state, dispatch] = useReducer(calendarReducer, getInitialState());

  // ✅ Hook de confirmación para eliminaciones
  const { confirm, ConfirmDialog } = useConfirmation();

  // Cargar eventos por rol
  useEffect(() => {
    dispatch({ type: "SET_EVENTS", payload: getEventsByRole(role) });
  }, [role]);

  // ✅ Cargar eventos personalizados del localStorage (solo al montar o al cambiar de rol)
  useEffect(() => {
    const savedCustomEvents = localStorage.getItem(`customEvents_${role}`);
    if (savedCustomEvents) {
      try {
        const customEvents = JSON.parse(savedCustomEvents).map(
          (event: { dueDate: string | number | Date }) => ({
            ...event,
            dueDate: new Date(event.dueDate),
          })
        );
        // ✅ Combina los eventos base + personalizados solo una vez
        const baseEvents = getEventsByRole(role);
        dispatch({
          type: "SET_EVENTS",
          payload: [...baseEvents, ...customEvents],
        });
      } catch (error) {
        console.error("Error loading custom events:", error);
      }
    } else {
      // Si no hay eventos personalizados, cargar solo los base
      dispatch({ type: "SET_EVENTS", payload: getEventsByRole(role) });
    }
  }, [role]);

  // ✅ useCallback: Guardar eventos personalizados
  const saveCustomEvents = useCallback(
    (allEvents: CalendarEvent[]) => {
      const customEvents = allEvents.filter((e) => e.isCustom);
      localStorage.setItem(`customEvents_${role}`, JSON.stringify(customEvents));
    },
    [role]
  );

  // ✅ useMemo: Cálculos de calendario (solo cuando currentDate cambia)
  const calendarData = useMemo(() => {
    const today = new Date();
    const year = state.currentDate.getFullYear();
    const month = state.currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    return {
      today,
      year,
      month,
      firstDayOfMonth,
      lastDayOfMonth,
      firstDayWeekday,
      daysInMonth,
    };
  }, [state.currentDate]);

  // ✅ useCallback: Handlers memoizados
  const getEventsForDate = useCallback(
    (date: Date) => {
      return state.events.filter((event) => {
        const eventDate = new Date(event.dueDate);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });
    },
    [state.events]
  );

  const isToday = useCallback(
    (date: Date) => {
      return (
        date.getDate() === calendarData.today.getDate() &&
        date.getMonth() === calendarData.today.getMonth() &&
        date.getFullYear() === calendarData.today.getFullYear()
      );
    },
    [calendarData.today]
  );

  const handleEventClick = useCallback(
    (event: CalendarEvent) => {
      if (event.isCustom) {
        dispatch({ type: "SELECT_EVENT", payload: event });
        dispatch({ type: "TOGGLE_EVENT_DETAIL_MODAL", payload: true });
      } else {
        onNavigate(event.type);
      }
    },
    [onNavigate]
  );

  const handleEditEvent = useCallback((event: CalendarEvent) => {
    dispatch({ type: "SET_EDITING_EVENT", payload: event });
    dispatch({
      type: "UPDATE_EVENT_FORM",
      payload: {
        title: event.title,
        description: event.description || "",
        priority: event.priority,
      },
    });
    dispatch({ type: "TOGGLE_EVENT_DETAIL_MODAL", payload: false });
    dispatch({ type: "TOGGLE_EVENT_MODAL", payload: true });
  }, []);

  const handleDateClick = useCallback(
    (date: Date) => {
      dispatch({ type: "SELECT_DATE", payload: date });
      const dayEvents = getEventsForDate(date);

      if (dayEvents.length === 0) {
        dispatch({ type: "SET_EDITING_EVENT", payload: null });
        dispatch({ type: "RESET_EVENT_FORM" });
        dispatch({ type: "TOGGLE_EVENT_MODAL", payload: true });
      }
    },
    [getEventsForDate]
  );

  const handleSaveEvent = useCallback(() => {
    if (!state.selectedDate || !state.newEventForm.title.trim()) return;

    if (state.editingEvent) {
      const editingEventId = state.editingEvent.id; // Guardar el ID

      // Editar evento existente
      dispatch({
        type: "UPDATE_EVENT",
        payload: {
          id: editingEventId,
          updates: {
            title: state.newEventForm.title,
            description: state.newEventForm.description,
            priority: state.newEventForm.priority,
          },
        },
      });

      const updatedEvents = state.events.map((event) =>
        event.id === editingEventId
          ? {
              ...event,
              title: state.newEventForm.title,
              description: state.newEventForm.description,
              priority: state.newEventForm.priority,
            }
          : event
      );
      saveCustomEvents(updatedEvents);
    } else {
      // Crear nuevo evento
      const newEvent: CalendarEvent = {
        id: `custom-${Date.now()}`,
        title: state.newEventForm.title,
        description: state.newEventForm.description,
        type: "plan-trabajo",
        priority: state.newEventForm.priority,
        dueDate: state.selectedDate,
        completed: false,
        isCustom: true,
      };
      dispatch({ type: "ADD_EVENT", payload: newEvent });
      saveCustomEvents([...state.events, newEvent]);
    }

    dispatch({ type: "TOGGLE_EVENT_MODAL", payload: false });
    dispatch({ type: "SET_EDITING_EVENT", payload: null });
    dispatch({ type: "RESET_EVENT_FORM" });
  }, [state.selectedDate, state.newEventForm, state.editingEvent, state.events, saveCustomEvents]);

  const handleDeleteEvent = useCallback(async () => {
    if (!state.editingEvent) return;

    // ✅ Mostrar confirmación antes de eliminar
    const confirmed = await confirm({
      title: "¿Eliminar actividad?",
      description: state.editingEvent.isCustom
        ? "Esta actividad personalizada será eliminada permanentemente."
        : "Esta es una actividad del sistema y no se puede eliminar.",
      type: state.editingEvent.isCustom ? "danger" : "warning",
      confirmText: state.editingEvent.isCustom ? "Eliminar" : "Entendido",
      cancelText: "Cancelar",
      showIcon: true,
    });

    // Si es del sistema o el usuario canceló, no hacer nada
    if (!confirmed || !state.editingEvent.isCustom) return;

    const editingEventId = state.editingEvent.id;
    dispatch({ type: "DELETE_EVENT", payload: editingEventId });
    saveCustomEvents(state.events.filter((event) => event.id !== editingEventId));
    dispatch({ type: "TOGGLE_EVENT_MODAL", payload: false });
    dispatch({ type: "SET_EDITING_EVENT", payload: null });
  }, [state.editingEvent, state.events, saveCustomEvents, confirm]);

  const handleDeleteFromDetail = useCallback(async () => {
    if (!state.selectedEvent) return;

    // ✅ Mostrar confirmación antes de eliminar desde el detalle
    const confirmed = await confirm({
      title: "¿Eliminar actividad?",
      description: state.selectedEvent.isCustom
        ? "Esta actividad personalizada será eliminada permanentemente."
        : "Las actividades del sistema no se pueden eliminar.",
      type: state.selectedEvent.isCustom ? "danger" : "warning",
      confirmText: state.selectedEvent.isCustom ? "Eliminar" : "Entendido",
      cancelText: "Cancelar",
      showIcon: true,
    });

    // Si es del sistema o el usuario canceló, no hacer nada
    if (!confirmed || !state.selectedEvent.isCustom) return;

    const selectedEventId = state.selectedEvent.id;
    dispatch({ type: "DELETE_EVENT", payload: selectedEventId });
    saveCustomEvents(state.events.filter((event) => event.id !== selectedEventId));
    dispatch({ type: "TOGGLE_EVENT_DETAIL_MODAL", payload: false });
    dispatch({ type: "SELECT_EVENT", payload: null });
  }, [state.selectedEvent, state.events, saveCustomEvents, confirm]);

  // ✅ useMemo: Funciones de utilidad
  const truncateText = useCallback((text: string, maxLength: number = 8) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "…";
  }, []);

  const getEventAbbreviation = useCallback(
    (title: string) => {
      const words = title.split(" ");
      if (words.length === 1) return truncateText(words[0], 6);
      if (words.length === 2) return `${words[0].charAt(0)}${words[1].charAt(0)}`;
      return words
        .slice(0, 3)
        .map((word) => word.charAt(0))
        .join("");
    },
    [truncateText]
  );

  // ✅ useMemo: Eventos próximos (solo recalcula si events cambia)
  const upcomingEvents = useMemo(() => {
    return state.events
      .filter((event) => !event.completed && event.dueDate >= calendarData.today)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 3);
  }, [state.events, calendarData.today]);

  // Renderizar días del calendario
  const renderCalendarDays = () => {
    const days = [];
    const { firstDayWeekday, daysInMonth, month, year } = calendarData;

    // Días vacíos antes del primer día del mes
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDate(date);
      const hasEvents = dayEvents.length > 0;
      const hasHighPriority = dayEvents.some((e) => e.priority === "high");
      const displayEvent = dayEvents[0];

      days.push(
        <div key={day} className="aspect-square p-0.5">
          <button
            onClick={() => handleDateClick(date)}
            className={`w-full h-full rounded-md p-0.5 text-center transition-all duration-200 hover:shadow-sm relative ${
              isToday(date) ? "ring-2" : ""
            }`}
            style={{
              backgroundColor: isToday(date) ? colors.primary[50] : "transparent",
              borderColor: isToday(date) ? colors.primary[500] : "transparent",
              color: isToday(date) ? colors.primary[700] : colors.text,
            }}
          >
            <span className="text-xs font-medium">{day}</span>
            {hasEvents && displayEvent && (
              <div className="mt-0.5">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(displayEvent);
                  }}
                  className="text-xs leading-tight p-0.5 rounded text-center w-full cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: getEventColor(displayEvent.type, displayEvent.priority).bg,
                    color: getEventColor(displayEvent.type, displayEvent.priority).text,
                    borderColor: getEventColor(displayEvent.type, displayEvent.priority).border,
                  }}
                >
                  {displayEvent.isCustom
                    ? truncateText(displayEvent.title, 6)
                    : getEventAbbreviation(displayEvent.title)}
                </div>
              </div>
            )}
            {hasEvents && dayEvents.length > 1 && (
              <div
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{
                  backgroundColor: hasHighPriority ? colors.error[500] : colors.warning[500],
                }}
              />
            )}
          </button>
        </div>
      );
    }

    return days;
  };

  return (
    <Card className="shadow-soft border-0" style={{ backgroundColor: colors.surface }}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: colors.primary[500] }} />
          <h2 className="text-base font-semibold font-display" style={{ color: colors.text }}>
            Calendario de Actividades
          </h2>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Navegación del calendario */}
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: "PREVIOUS_MONTH" })}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>
            {monthNames[calendarData.month]} {calendarData.year}
          </h3>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: "NEXT_MONTH" })}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Nombres de los días */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium"
              style={{ color: colors.textMuted }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Días del calendario */}
        <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

        {/* Próximas actividades */}
        <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
          <h4 className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
            Próximas Actividades
          </h4>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-2">
              <Calendar className="h-6 w-6 mx-auto mb-1" style={{ color: colors.textMuted }} />
              <p className="text-xs" style={{ color: colors.textMuted }}>
                No hay actividades pendientes
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map((event) => {
                const eventColors = getEventColor(event.type, event.priority);
                const daysUntil = Math.ceil(
                  (event.dueDate.getTime() - calendarData.today.getTime()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="w-full p-2 rounded-lg border transition-all duration-200 hover:shadow-sm text-left"
                    style={{
                      backgroundColor: eventColors.bg,
                      borderColor: eventColors.border,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-medium truncate"
                          style={{ color: eventColors.text }}
                        >
                          {event.title}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" style={{ color: colors.textMuted }} />
                          <span className="text-xs" style={{ color: colors.textMuted }}>
                            {daysUntil === 0
                              ? "Hoy"
                              : daysUntil === 1
                                ? "Mañana"
                                : `En ${daysUntil} días`}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs shrink-0"
                        style={{
                          backgroundColor: eventColors.bg,
                          borderColor: eventColors.border,
                          color: eventColors.text,
                        }}
                      >
                        {event.priority === "high"
                          ? "Alta"
                          : event.priority === "medium"
                            ? "Media"
                            : "Baja"}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal de detalle de evento */}
        {state.showEventDetailModal && state.selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full shadow-xl" style={{ backgroundColor: colors.surface }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" style={{ color: colors.primary[500] }} />
                    <span style={{ color: colors.text }}>Detalles de la Actividad</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => dispatch({ type: "TOGGLE_EVENT_DETAIL_MODAL", payload: false })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
                    {state.selectedEvent.title}
                  </h3>
                  {state.selectedEvent.description && (
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {state.selectedEvent.description}
                    </p>
                  )}
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: colors.textMuted }}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{state.selectedEvent.dueDate.toLocaleDateString("es-AR")}</span>
                  </div>
                </div>

                <div
                  className="flex justify-between pt-4 border-t"
                  style={{ borderColor: colors.border }}
                >
                  <Button
                    variant="outline"
                    onClick={handleDeleteFromDetail}
                    style={{ borderColor: colors.error[500], color: colors.error[500] }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                  <Button
                    onClick={() => handleEditEvent(state.selectedEvent!)}
                    style={{ backgroundColor: colors.primary[500], color: colors.surface }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal de crear/editar evento */}
        {state.showEventModal && state.selectedDate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full shadow-xl" style={{ backgroundColor: colors.surface }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" style={{ color: colors.primary[500] }} />
                    <span style={{ color: colors.text }}>
                      {state.editingEvent ? "Editar Actividad" : "Nueva Actividad"}
                    </span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      dispatch({ type: "TOGGLE_EVENT_MODAL", payload: false });
                      dispatch({ type: "SET_EDITING_EVENT", payload: null });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title" style={{ color: colors.text }}>
                    Título
                  </Label>
                  <Input
                    id="event-title"
                    value={state.newEventForm.title}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_EVENT_FORM", payload: { title: e.target.value } })
                    }
                    placeholder="Título de la actividad"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-description" style={{ color: colors.text }}>
                    Descripción
                  </Label>
                  <Textarea
                    id="event-description"
                    value={state.newEventForm.description}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_EVENT_FORM",
                        payload: { description: e.target.value },
                      })
                    }
                    placeholder="Descripción opcional"
                    rows={3}
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-priority" style={{ color: colors.text }}>
                    Prioridad
                  </Label>
                  <select
                    id="event-priority"
                    value={state.newEventForm.priority}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_EVENT_FORM",
                        payload: { priority: e.target.value as "high" | "medium" | "low" },
                      })
                    }
                    className="w-full p-2 rounded-md border"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                  >
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  {state.editingEvent && (
                    <Button
                      variant="outline"
                      onClick={handleDeleteEvent}
                      className="flex-1"
                      style={{ borderColor: colors.error[500], color: colors.error[500] }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  )}
                  <Button
                    onClick={handleSaveEvent}
                    className="flex-1"
                    style={{ backgroundColor: colors.primary[500], color: colors.surface }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {state.editingEvent ? "Actualizar" : "Guardar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>

      {/* ✅ Dialog de confirmación para eliminaciones */}
      <ConfirmDialog />
    </Card>
  );
}
