import { z } from "zod";

/**
 * Schema para Informe Inicial
 */
export const initialReportSchema = z.object({
  patientName: z
    .string()
    .min(1, "El nombre del paciente es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),

  dni: z
    .string()
    .min(1, "El DNI es obligatorio")
    .min(7, "El DNI debe tener entre 7 y 8 dígitos")
    .max(8, "El DNI debe tener entre 7 y 8 dígitos")
    .regex(/^\d+$/, "El DNI solo puede contener números"),

  birthDate: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria")
    .refine(
      (date) => {
        const birthDate = new Date(date);
        const today = new Date();
        return birthDate < today;
      },
      { message: "La fecha de nacimiento debe ser anterior a hoy" }
    ),

  reportDate: z.string().min(1, "La fecha del informe es obligatoria"),

  diagnosis: z.string().min(1, "El diagnóstico es obligatorio").min(10, "El diagnóstico debe tener al menos 10 caracteres"),

  introduction: z.string().min(1, "La introducción es obligatoria").min(20, "La introducción debe tener al menos 20 caracteres"),

  characterization: z
    .string()
    .min(1, "La caracterización es obligatoria")
    .min(20, "La caracterización debe tener al menos 20 caracteres"),
});

export type InitialReportFormData = z.infer<typeof initialReportSchema>;

/**
 * Schema para Informe Semestral
 */
export const semesterReportSchema = z.object({
  patientName: z.string().min(1, "El nombre del paciente es obligatorio"),

  dni: z
    .string()
    .min(1, "El DNI es obligatorio")
    .min(7, "El DNI debe tener entre 7 y 8 dígitos")
    .max(8, "El DNI debe tener entre 7 y 8 dígitos")
    .regex(/^\d+$/, "El DNI solo puede contener números"),

  reportDate: z.string().min(1, "La fecha del informe es obligatoria"),

  period: z.string().min(1, "El período es obligatorio"),

  progress: z.string().min(1, "El progreso es obligatorio").min(50, "Describe el progreso con al menos 50 caracteres"),

  achievements: z
    .string()
    .min(1, "Los logros son obligatorios")
    .min(30, "Describe los logros con al menos 30 caracteres"),

  challenges: z
    .string()
    .min(1, "Los desafíos son obligatorios")
    .min(30, "Describe los desafíos con al menos 30 caracteres"),

  recommendations: z
    .string()
    .min(1, "Las recomendaciones son obligatorias")
    .min(30, "Proporciona recomendaciones con al menos 30 caracteres"),
});

export type SemesterReportFormData = z.infer<typeof semesterReportSchema>;

/**
 * Schema para Reporte Mensual (Acompañantes)
 */
export const monthlyReportSchema = z.object({
  studentName: z.string().min(1, "El nombre del estudiante es obligatorio"),

  month: z.string().min(1, "El mes es obligatorio"),

  year: z
    .string()
    .min(1, "El año es obligatorio")
    .regex(/^\d{4}$/, "Formato de año inválido"),

  attendance: z.number().min(0, "La asistencia no puede ser negativa").max(100, "La asistencia no puede ser mayor a 100"),

  activities: z.string().min(1, "Las actividades son obligatorias").min(50, "Describe las actividades con al menos 50 caracteres"),

  observations: z
    .string()
    .min(1, "Las observaciones son obligatorias")
    .min(30, "Las observaciones deben tener al menos 30 caracteres"),

  nextSteps: z.string().min(1, "Los próximos pasos son obligatorios").min(30, "Describe los próximos pasos con al menos 30 caracteres"),
});

export type MonthlyReportFormData = z.infer<typeof monthlyReportSchema>;

/**
 * Schema para Plan de Trabajo
 */
export const workPlanSchema = z.object({
  patientName: z.string().min(1, "El nombre del paciente/estudiante es obligatorio"),

  dni: z
    .string()
    .min(1, "El DNI es obligatorio")
    .min(7, "El DNI debe tener entre 7 y 8 dígitos")
    .max(8, "El DNI debe tener entre 7 y 8 dígitos")
    .regex(/^\d+$/, "El DNI solo puede contener números"),

  startDate: z.string().min(1, "La fecha de inicio es obligatoria"),

  endDate: z.string().min(1, "La fecha de fin es obligatoria"),

  objectives: z.string().min(1, "Los objetivos son obligatorios").min(50, "Describe los objetivos con al menos 50 caracteres"),

  activities: z.string().min(1, "Las actividades son obligatorias").min(50, "Describe las actividades con al menos 50 caracteres"),

  methodology: z
    .string()
    .min(1, "La metodología es obligatoria")
    .min(50, "Describe la metodología con al menos 50 caracteres"),

  resources: z.string().min(1, "Los recursos son obligatorios"),

  evaluation: z.string().min(1, "La evaluación es obligatoria").min(30, "Describe la evaluación con al menos 30 caracteres"),
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  },
  {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["endDate"],
  }
);

export type WorkPlanFormData = z.infer<typeof workPlanSchema>;

/**
 * Schema para Actas de Reunión
 */
export const meetingMinutesSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").min(5, "El título debe tener al menos 5 caracteres"),

  date: z.string().min(1, "La fecha es obligatoria"),

  attendees: z.string().min(1, "Los asistentes son obligatorios").min(5, "Lista al menos un asistente"),

  agenda: z.string().min(1, "La agenda es obligatoria").min(20, "Describe la agenda con al menos 20 caracteres"),

  discussion: z.string().min(1, "La discusión es obligatoria").min(50, "Describe la discusión con al menos 50 caracteres"),

  agreements: z.string().min(1, "Los acuerdos son obligatorios").min(30, "Describe los acuerdos con al menos 30 caracteres"),

  nextMeeting: z.string().optional(),
});

export type MeetingMinutesFormData = z.infer<typeof meetingMinutesSchema>;

