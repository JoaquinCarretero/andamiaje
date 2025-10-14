/**
 * Esquemas Zod Completos para Formularios
 * Basado en GUIA_CREACION_FORMULARIOS_POR_ROL.md
 */

import { z } from 'zod';
import { FORMTYPE, Modality, Priority, ObjectiveStatus, Severity, Prognosis } from '@/types/forms';

// ========================================
// SCHEMAS BASE
// ========================================

export const baseFormDataSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').min(5, 'El título debe tener al menos 5 caracteres'),
  
  patientName: z.string().optional(),
  patientDocumentNumber: z.string().optional(),
  patientAge: z.number().min(0).max(120).optional(),
  patientBirthDate: z.string().optional(), // YYYY-MM-DD
  patientDiagnosis: z.string().optional(),
  notes: z.string().optional(),
});

// ========================================
// ACTAS (Actas de Reunión)
// ========================================

const attendeeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre del asistente es obligatorio'),
  role: z.string().min(1, 'El rol es obligatorio'),
  attended: z.boolean(),
  signature: z.string().optional(),
});

export const actasSpecificDataSchema = z.object({
  modality: z.enum(['VIRTUAL', 'PRESENCIAL', 'MIXTA'], {
    message: 'Selecciona una modalidad válida',
  }),
  subject: z.string().min(1, 'El asunto es obligatorio').min(5, 'El asunto debe tener al menos 5 caracteres'),
  agenda: z.string().min(1, 'La agenda es obligatoria').min(20, 'La agenda debe tener al menos 20 caracteres'),
  meetingDate: z.string().min(1, 'La fecha de reunión es obligatoria'),
  durationMinutes: z.number().min(1).max(480).default(60),
  
  location: z.string().optional(),
  meetingUrl: z.string().url('URL inválida').optional(),
  
  attendees: z.array(attendeeSchema).min(1, 'Debe haber al menos un asistente'),
  
  decisions: z.string().min(1, 'Las decisiones son obligatorias').min(20, 'Describe las decisiones con al menos 20 caracteres'),
  agreements: z.string().optional(),
  nextSteps: z.string().optional(),
  nextMeetingDate: z.string().optional(),
  additionalNotes: z.string().optional(),
}).refine(
  (data) => {
    if (data.modality === 'VIRTUAL') {
      return !!data.meetingUrl;
    }
    return true;
  },
  {
    message: 'La URL de reunión es obligatoria para modalidad virtual',
    path: ['meetingUrl'],
  }
).refine(
  (data) => {
    if (data.modality === 'PRESENCIAL') {
      return !!data.location;
    }
    return true;
  },
  {
    message: 'La ubicación es obligatoria para modalidad presencial',
    path: ['location'],
  }
);

export const actasFormSchema = z.object({
  type: z.literal(FORMTYPE.ACTAS),
  baseData: baseFormDataSchema,
  specificData: actasSpecificDataSchema,
});

export type ActasFormInput = z.infer<typeof actasFormSchema>;

// ========================================
// PLAN DE TRABAJO
// ========================================

const generalObjectiveSchema = z.object({
  id: z.string(),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  indicators: z.string().min(1, 'Los indicadores son obligatorios'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'ACHIEVED', 'NOT_ACHIEVED']).default('PENDING'),
});

const specificObjectiveSchema = z.object({
  id: z.string(),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  generalObjectiveId: z.string(),
  expectedOutcome: z.string().min(1, 'El resultado esperado es obligatorio'),
  evaluationCriteria: z.string().min(1, 'Los criterios de evaluación son obligatorios'),
  deadline: z.string(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'ACHIEVED', 'NOT_ACHIEVED']).default('PENDING'),
});

const methodologySchema = z.object({
  approach: z.string().min(20, 'El enfoque debe tener al menos 20 caracteres'),
  techniques: z.array(z.string()).min(1, 'Debe especificar al menos una técnica'),
  materials: z.array(z.string()).min(1, 'Debe especificar al menos un material'),
  frequency: z.string().min(1, 'La frecuencia es obligatoria'),
  sessionDuration: z.number().min(15, 'La duración mínima es 15 minutos').max(240, 'La duración máxima es 240 minutos'),
});

export const planTrabajoSpecificDataSchema = z.object({
  startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
  endDate: z.string().min(1, 'La fecha de fin es obligatoria'),
  duration: z.number().optional(),
  modality: z.enum(['VIRTUAL', 'PRESENCIAL', 'MIXTA']),
  
  generalObjectives: z.array(generalObjectiveSchema).min(1, 'Debe haber al menos un objetivo general'),
  specificObjectives: z.array(specificObjectiveSchema).min(2, 'Debe haber al menos dos objetivos específicos'),
  
  methodology: methodologySchema,
  
  schedule: z.array(z.object({
    month: z.number().min(1).max(12),
    activities: z.array(z.string()),
    objectives: z.array(z.string()),
    evaluation: z.string(),
  })).optional(),
  
  evaluationMethod: z.string().min(20, 'El método de evaluación debe tener al menos 20 caracteres'),
  evaluationFrequency: z.string().optional(),
  progressIndicators: z.array(z.string()).optional(),
  
  humanResources: z.array(z.object({
    role: z.string(),
    name: z.string(),
    responsibilities: z.string(),
  })).optional(),
  materialResources: z.array(z.string()).optional(),
  estimatedBudget: z.number().min(0).optional(),
  
  observations: z.string().optional(),
  recommendations: z.string().optional(),
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  },
  {
    message: 'La fecha de fin debe ser posterior a la fecha de inicio',
    path: ['endDate'],
  }
);

export const planTrabajoFormSchema = z.object({
  type: z.literal(FORMTYPE.PLAN_TRABAJO),
  baseData: baseFormDataSchema.extend({
    patientName: z.string().min(1, 'El nombre del paciente es obligatorio'),
    patientDocumentNumber: z.string().min(1, 'El DNI es obligatorio'),
    patientAge: z.number().optional(),
    patientBirthDate: z.string().optional(),
    patientDiagnosis: z.string().min(1, 'El diagnóstico es obligatorio'),
  }),
  specificData: planTrabajoSpecificDataSchema,
});

export type PlanTrabajoFormInput = z.infer<typeof planTrabajoFormSchema>;

// ========================================
// REPORTE MENSUAL
// ========================================

const activitySchema = z.object({
  date: z.string(),
  type: z.string().min(1, 'El tipo de actividad es obligatorio'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  duration: z.number().min(1),
  participants: z.array(z.string()),
  observations: z.string(),
});

export const reporteMensualSpecificDataSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
  periodStart: z.string(),
  periodEnd: z.string(),
  
  monthlySummary: z.string().min(50, 'El resumen debe tener al menos 50 caracteres'),
  
  activities: z.array(activitySchema).min(1, 'Debe registrar al menos una actividad'),
  
  progress: z.object({
    achievements: z.array(z.string()).min(1, 'Debe registrar al menos un logro'),
    difficulties: z.array(z.string()),
    emergingSkills: z.array(z.string()),
    areasOfConcern: z.array(z.string()),
  }),
  
  attendance: z.object({
    plannedSessions: z.number().min(0),
    attendedSessions: z.number().min(0),
    missedSessions: z.number().min(0),
    attendanceRate: z.number().min(0).max(100),
    missedReasons: z.array(z.string()),
  }),
  
  behavior: z.object({
    mood: z.string(),
    motivation: z.enum(['HIGH', 'MEDIUM', 'LOW']),
    cooperation: z.enum(['HIGH', 'MEDIUM', 'LOW']),
    significantBehaviors: z.array(z.string()),
  }),
  
  familyInvolvement: z.object({
    level: z.enum(['HIGH', 'MEDIUM', 'LOW']),
    activities: z.array(z.string()),
    feedback: z.string(),
  }),
  
  observations: z.string().optional(),
  incidents: z.array(z.string()).optional(),
  celebrations: z.array(z.string()).optional(),
  
  nextMonthPlanning: z.string().optional(),
  recommendations: z.string().optional(),
});

export const reporteMensualFormSchema = z.object({
  type: z.literal(FORMTYPE.REPORTE_MENSUAL),
  baseData: baseFormDataSchema.extend({
    patientName: z.string().min(1, 'El nombre del paciente es obligatorio'),
    patientDocumentNumber: z.string().min(1, 'El DNI es obligatorio'),
  }),
  specificData: reporteMensualSpecificDataSchema,
});

export type ReporteMensualFormInput = z.infer<typeof reporteMensualFormSchema>;

// Note: No re-exportamos schemas que ya existen en reports.schema.ts
// para evitar conflictos. Estos schemas son complementarios.

