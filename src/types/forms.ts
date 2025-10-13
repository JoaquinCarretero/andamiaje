/**
 * Types para Formularios - Basado en GUIA_CREACION_FORMULARIOS_POR_ROL.md
 *
 * Define la estructura de todos los tipos de formularios según el backend
 */

import type { UserI, UserRole } from "./auth";

// ========================================
// ENUMS
// ========================================

/**
 * Tipos de formularios disponibles en el sistema
 */
export enum FORMTYPE {
  PLAN_TRABAJO = "PLAN_TRABAJO",
  INFORME_SEMESTRAL = "INFORME_SEMESTRAL",
  INFORME_ADMISION = "INFORME_ADMISION",
  ACTAS = "ACTAS",
  REPORTE_MENSUAL = "REPORTE_MENSUAL",
  SEGUIMIENTO_ACOMPANANTE = "SEGUIMIENTO_ACOMPANANTE_EXTERNO",
  SEGUIMIENTO_FAMILIA = "SEGUIMIENTO_FAMILIA",
  FACTURA = "FACTURA",
}

/**
 * Estados de un formulario en el workflow
 */
export enum DocumentStatus {
  DRAFT = "DRAFT",
  PENDING_REVIEW = "PENDING_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ARCHIVED = "ARCHIVED",
}

/**
 * Modalidades de intervención
 */
export type Modality = "VIRTUAL" | "PRESENCIAL" | "MIXTA";

/**
 * Niveles de prioridad
 */
export type Priority = "HIGH" | "MEDIUM" | "LOW";

/**
 * Estados de objetivo
 */
export type ObjectiveStatus = "PENDING" | "IN_PROGRESS" | "ACHIEVED" | "NOT_ACHIEVED";

/**
 * Niveles de severidad
 */
export type Severity = "MILD" | "MODERATE" | "SEVERE";

/**
 * Pronóstico
 */
export type Prognosis = "FAVORABLE" | "RESERVED" | "UNFAVORABLE";

// ========================================
// INTERFACES BASE
// ========================================

/**
 * Datos base de todos los formularios (BaseForm)
 */
export interface BaseFormData {
  title: string;
  patientName?: string;
  patientDocumentNumber?: string;
  patientAge?: number;
  patientBirthDate?: string; // YYYY-MM-DD
  patientDiagnosis?: string;
  notes?: string;
}

/**
 * Campos autogenerados por el sistema (no enviar en creación)
 */
export interface FormMetadata {
  id: string;
  type: FORMTYPE;
  status: DocumentStatus;
  version: number;
  createdBy: UserI;
  createdAt: string;
  updatedAt: string;
}

/**
 * Estructura general de un formulario para enviar al backend
 */
export interface FormSubmission<T = any> {
  type: FORMTYPE;
  baseData: BaseFormData;
  specificData: T;
}

/**
 * Respuesta del backend al crear/actualizar un formulario
 */
export interface FormResponse<T = any> extends FormMetadata {
  baseData: BaseFormData;
  specificData: T;
}

// ========================================
// ACTAS (Actas de Reunión)
// ========================================

export interface Attendee {
  id?: string;
  name: string;
  role: string;
  attended: boolean;
  signature?: string;
}

export interface ActasSpecificData {
  // Información de la reunión
  modality: Modality;
  subject: string;
  agenda: string;
  meetingDate: string; // YYYY-MM-DDTHH:mm:ss
  durationMinutes?: number;

  // Ubicación
  location?: string; // Obligatorio si PRESENCIAL
  meetingUrl?: string; // Obligatorio si VIRTUAL

  // Asistentes
  attendees: Attendee[];

  // Contenido
  decisions: string;
  agreements?: string;
  nextSteps?: string;
  nextMeetingDate?: string; // YYYY-MM-DD
  additionalNotes?: string;
}

export type ActasFormData = BaseFormData & ActasSpecificData;

// ========================================
// PLAN DE TRABAJO
// ========================================

export interface GeneralObjective {
  id: string;
  description: string;
  priority: Priority;
  indicators: string;
  status: ObjectiveStatus;
}

export interface SpecificObjective {
  id: string;
  description: string;
  generalObjectiveId: string;
  expectedOutcome: string;
  evaluationCriteria: string;
  deadline: string; // YYYY-MM-DD
  status: ObjectiveStatus;
}

export interface Methodology {
  approach: string;
  techniques: string[];
  materials: string[];
  frequency: string;
  sessionDuration: number; // minutos
}

export interface ScheduleItem {
  month: number; // 1-12
  activities: string[];
  objectives: string[]; // IDs de objetivos
  evaluation: string;
}

export interface HumanResource {
  role: string;
  name: string;
  responsibilities: string;
}

export interface PlanTrabajoSpecificData {
  // Información general
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  duration?: number; // meses
  modality: Modality;

  // Objetivos
  generalObjectives: GeneralObjective[];
  specificObjectives: SpecificObjective[];

  // Metodología
  methodology: Methodology;

  // Cronograma
  schedule?: ScheduleItem[];

  // Evaluación
  evaluationMethod: string;
  evaluationFrequency?: string;
  progressIndicators?: string[];

  // Recursos
  humanResources?: HumanResource[];
  materialResources?: string[];
  estimatedBudget?: number;

  // Observaciones
  observations?: string;
  recommendations?: string;
}

export type PlanTrabajoFormData = Required<
  Pick<
    BaseFormData,
    | "title"
    | "patientName"
    | "patientDocumentNumber"
    | "patientAge"
    | "patientBirthDate"
    | "patientDiagnosis"
  >
> &
  PlanTrabajoSpecificData;

// ========================================
// INFORME SEMESTRAL
// ========================================

export interface ObjectiveEvaluation {
  objectiveId: string;
  description: string;
  initialStatus: string;
  currentStatus: ObjectiveStatus;
  progressPercentage: number; // 0-100
  evidence: string;
  observations: string;
}

export interface AreaEvaluation {
  score: number; // 1-10
  description: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface AreasEvaluation {
  communication: AreaEvaluation;
  cognition: AreaEvaluation;
  socialSkills: AreaEvaluation;
  autonomy: AreaEvaluation;
}

export interface SessionsInfo {
  planned: number;
  completed: number;
  cancelled: number;
  attendanceRate: number;
  cancellationReasons: string[];
}

export interface MethodologyUsed {
  techniques: string[];
  materials: string[];
  adaptations: string;
}

export interface FamilyParticipation {
  level: Priority;
  description: string;
  observations: string;
}

export interface InformeSemestralSpecificData {
  // Periodo
  periodStart: string; // YYYY-MM-DD
  periodEnd: string; // YYYY-MM-DD
  semester: 1 | 2;
  year: number;

  // Resumen
  executiveSummary: string;

  // Evaluación
  objectivesEvaluation: ObjectiveEvaluation[];
  areasEvaluation: AreasEvaluation;

  // Sesiones
  sessionsInfo: SessionsInfo;

  // Metodología
  methodologyUsed: MethodologyUsed;

  // Familia
  familyParticipation: FamilyParticipation;

  // Conclusiones
  conclusions: string;
  recommendations: string;
  proposedAdjustments?: string;

  // Próximos pasos
  nextSteps?: string;
  requiresPlanAdjustment: boolean;
  suggestedFrequency?: string;
}

export type InformeSemestralFormData = Required<
  Pick<
    BaseFormData,
    | "title"
    | "patientName"
    | "patientDocumentNumber"
    | "patientAge"
    | "patientBirthDate"
    | "patientDiagnosis"
  >
> &
  InformeSemestralSpecificData;

// ========================================
// INFORME DE ADMISIÓN
// ========================================

export interface PrimaryCaregiver {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface FamilyData {
  primaryCaregiver: PrimaryCaregiver;
  familyComposition: string[];
  familyDynamics: string;
  socioeconomicLevel: Priority;
}

export interface MedicalHistory {
  prenatalHistory: string;
  perinatalHistory: string;
  postnatalHistory: string;
  developmentalMilestones: string;
  previousTreatments: string[];
  currentMedication: string[];
  allergies: string[];
}

export interface SkillEvaluation {
  score: number;
  [key: string]: any; // Campos dinámicos según el área
}

export interface InitialEvaluation {
  communicationSkills: SkillEvaluation & {
    receptive: string;
    expressive: string;
    pragmatic: string;
  };
  cognitiveSkills: SkillEvaluation & {
    attention: string;
    memory: string;
    reasoning: string;
  };
  socialSkills: SkillEvaluation & {
    interaction: string;
    cooperation: string;
    empathy: string;
  };
  motorSkills: SkillEvaluation & {
    gross: string;
    fine: string;
  };
}

export interface AssessmentTool {
  name: string;
  date: string; // YYYY-MM-DD
  results: string;
  conclusions: string;
}

export interface Diagnosis {
  primary: string;
  secondary: string[];
  severity: Severity;
  prognosis: Prognosis;
}

export interface Recommendations {
  interventionType: string;
  frequency: string;
  duration: string;
  additionalServices: string[];
  familyGuidance: string;
}

export interface InformeAdmisionSpecificData {
  // Información de admisión
  admissionDate: string; // YYYY-MM-DD
  referralSource: string;
  referralReason: string;

  // Datos adicionales del paciente
  patientAddress: string;
  patientPhone: string;
  patientEmail: string;

  // Datos familiares
  familyData: FamilyData;

  // Antecedentes
  medicalHistory: MedicalHistory;

  // Evaluación inicial
  initialEvaluation: InitialEvaluation;

  // Instrumentos
  assessmentTools: AssessmentTool[];

  // Diagnóstico
  diagnosis: Diagnosis;

  // Recomendaciones
  recommendations: Recommendations;

  // Conclusiones
  conclusions: string;
  urgencyLevel: Priority;
}

export type InformeAdmisionFormData = Required<
  Pick<
    BaseFormData,
    | "title"
    | "patientName"
    | "patientDocumentNumber"
    | "patientAge"
    | "patientBirthDate"
    | "patientDiagnosis"
  >
> &
  InformeAdmisionSpecificData;

// ========================================
// REPORTE MENSUAL
// ========================================

export interface Activity {
  date: string; // YYYY-MM-DD
  type: string;
  description: string;
  duration: number; // minutos
  participants: string[];
  observations: string;
}

export interface Progress {
  achievements: string[];
  difficulties: string[];
  emergingSkills: string[];
  areasOfConcern: string[];
}

export interface Attendance {
  plannedSessions: number;
  attendedSessions: number;
  missedSessions: number;
  attendanceRate: number;
  missedReasons: string[];
}

export interface Behavior {
  mood: string;
  motivation: Priority;
  cooperation: Priority;
  significantBehaviors: string[];
}

export interface FamilyInvolvement {
  level: Priority;
  activities: string[];
  feedback: string;
}

export interface ReporteMensualSpecificData {
  // Periodo
  month: number; // 1-12
  year: number;
  periodStart: string; // YYYY-MM-DD
  periodEnd: string; // YYYY-MM-DD

  // Resumen
  monthlySummary: string;

  // Actividades
  activities: Activity[];

  // Progreso
  progress: Progress;

  // Asistencia
  attendance: Attendance;

  // Comportamiento
  behavior: Behavior;

  // Familia
  familyInvolvement: FamilyInvolvement;

  // Observaciones
  observations?: string;
  incidents?: string[];
  celebrations?: string[];

  // Próximo mes
  nextMonthPlanning?: string;
  recommendations?: string;
}

export type ReporteMensualFormData = Required<
  Pick<BaseFormData, "title" | "patientName" | "patientDocumentNumber">
> &
  ReporteMensualSpecificData;

// ========================================
// SEGUIMIENTO ACOMPAÑANTE EXTERNO
// ========================================

export interface AccompanistInfo {
  name: string;
  documentNumber: string;
  relationshipToPatient: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
}

export interface AccompanimentActivity {
  date: string; // YYYY-MM-DD
  type: string;
  description: string;
  location: string;
  duration: number; // minutos
  observations: string;
}

export interface AccompanimentEvaluation {
  commitment: {
    score: number; // 1-10
    description: string;
  };
  effectiveness: {
    score: number;
    description: string;
  };
  communication: {
    score: number;
    description: string;
  };
  relationshipWithPatient: {
    score: number;
    description: string;
  };
}

export interface CoordinationWithTeam {
  frequency: string;
  quality: Priority;
  observations: string;
}

export interface SeguimientoAcompananteSpecificData {
  // Información del acompañante
  accompanistInfo: AccompanistInfo;

  // Periodo
  periodStart: string; // YYYY-MM-DD
  periodEnd: string; // YYYY-MM-DD

  // Actividades
  accompanimentActivities: AccompanimentActivity[];

  // Evaluación
  evaluation: AccompanimentEvaluation;

  // Observaciones
  strengths: string[];
  areasForImprovement: string[];
  challenges: string[];
  successStories: string[];

  // Coordinación
  coordinationWithTeam: CoordinationWithTeam;

  // Recomendaciones
  recommendations: string;
  trainingNeeds: string[];
  supportRequired?: string;
}

export type SeguimientoAcompananteFormData = Required<
  Pick<BaseFormData, "title" | "patientName" | "patientDocumentNumber">
> &
  SeguimientoAcompananteSpecificData;

// ========================================
// SEGUIMIENTO FAMILIA
// ========================================

export interface FamilyMember {
  name: string;
  relationship: string;
  age: number;
  occupation: string;
  involvementLevel: Priority;
}

export interface FamilyContact {
  date: string; // YYYY-MM-DD
  type: "PRESENCIAL" | "TELEFÓNICO" | "VIRTUAL";
  participants: string[];
  topics: string[];
  duration: number; // minutos
  agreements: string;
  observations: string;
}

export interface FamilyDynamics {
  communication: {
    quality: Priority;
    description: string;
  };
  supportNetwork: {
    strength: Priority;
    description: string;
  };
  parentingStyle: string;
  conflictResolution: string;
  cohesion: {
    level: Priority;
    description: string;
  };
}

export interface IdentifiedNeed {
  category: string;
  description: string;
  priority: Priority;
  proposedIntervention: string;
}

export interface FamilyResources {
  economic: "SUFFICIENT" | "LIMITED" | "INSUFFICIENT";
  emotional: "STRONG" | "MODERATE" | "WEAK";
  social: "EXTENSIVE" | "MODERATE" | "LIMITED";
  educational: Priority;
}

export interface ParticipationInfo {
  sessionsAttendance: number;
  homeActivitiesCompliance: Priority;
  communicationFrequency: Priority;
  observations: string;
}

export interface PeriodEvaluation {
  progressAchieved: string[];
  persistentChallenges: string[];
  familyStrengths: string[];
  areasForImprovement: string[];
}

export interface SeguimientoFamiliaSpecificData {
  // Información familiar
  familyComposition: FamilyMember[];

  // Periodo
  periodStart: string; // YYYY-MM-DD
  periodEnd: string; // YYYY-MM-DD

  // Contactos
  familyContacts: FamilyContact[];

  // Dinámica
  familyDynamics: FamilyDynamics;

  // Necesidades
  identifiedNeeds: IdentifiedNeed[];

  // Recursos
  familyResources: FamilyResources;

  // Participación
  participation: ParticipationInfo;

  // Evaluación
  periodEvaluation: PeriodEvaluation;

  // Recomendaciones
  recommendations: string;
  suggestedInterventions: string[];
  referrals: string[];
}

export type SeguimientoFamiliaFormData = Required<
  Pick<BaseFormData, "title" | "patientName" | "patientDocumentNumber">
> &
  SeguimientoFamiliaSpecificData;

// ========================================
// FACTURA
// ========================================

export interface ClientInfo {
  name: string;
  documentNumber: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface IssuerInfo {
  name?: string;
  documentNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
  subtotal: number;
  total: number;
}

export interface PaymentInfo {
  method: "EFECTIVO" | "TRANSFERENCIA" | "TARJETA" | "OTRO";
  reference?: string;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  paidDate?: string; // YYYY-MM-DD
  paidAmount?: number;
}

export interface FacturaSpecificData {
  // Información de factura
  invoiceNumber: string;
  invoiceDate: string; // YYYY-MM-DD
  dueDate?: string; // YYYY-MM-DD

  // Datos
  clientInfo: ClientInfo;
  issuerInfo?: IssuerInfo;

  // Items
  items: InvoiceItem[];

  // Totales
  subtotal: number;
  discountTotal?: number;
  taxTotal?: number;
  total: number;

  // Pago
  paymentInfo: PaymentInfo;

  // Observaciones
  notes?: string;
  terms?: string;

  // Relación con paciente (opcional)
  serviceType?: string;
  servicePeriod?: string;
}

export type FacturaFormData = BaseFormData & FacturaSpecificData;

// ========================================
// UNION TYPES
// ========================================

/**
 * Union type de todos los datos específicos de formularios
 */
export type FormSpecificData =
  | ActasSpecificData
  | PlanTrabajoSpecificData
  | InformeSemestralSpecificData
  | InformeAdmisionSpecificData
  | ReporteMensualSpecificData
  | SeguimientoAcompananteSpecificData
  | SeguimientoFamiliaSpecificData
  | FacturaSpecificData;

/**
 * Union type de todos los formularios completos
 */
export type AnyFormData =
  | ActasFormData
  | PlanTrabajoFormData
  | InformeSemestralFormData
  | InformeAdmisionFormData
  | ReporteMensualFormData
  | SeguimientoAcompananteFormData
  | SeguimientoFamiliaFormData
  | FacturaFormData;

// ========================================
// PERMISOS POR ROL
// ========================================

/**
 * Matriz de permisos: qué formularios puede crear cada rol
 */
export const rolePermissions: Record<UserRole, FORMTYPE[]> = {
  DIRECTOR: Object.values(FORMTYPE),

  COORDINADOR_UNO: [
    FORMTYPE.INFORME_SEMESTRAL,
    FORMTYPE.INFORME_ADMISION,
    FORMTYPE.PLAN_TRABAJO,
    FORMTYPE.SEGUIMIENTO_ACOMPANANTE,
    FORMTYPE.ACTAS,
    FORMTYPE.FACTURA,
    FORMTYPE.REPORTE_MENSUAL,
  ],

  // COORDINADOR_DOS: [ // TODO: Agregar a src/types/auth.ts cuando se implemente
  //   FORMTYPE.SEGUIMIENTO_FAMILIA,
  //   FORMTYPE.ACTAS,
  //   FORMTYPE.FACTURA,
  //   FORMTYPE.INFORME_SEMESTRAL,
  // ],

  COORDINADOR: [
    // Genérico - Incluye funcionalidad de COORDINADOR_UNO y DOS
    FORMTYPE.SEGUIMIENTO_FAMILIA,
    FORMTYPE.ACTAS,
    FORMTYPE.FACTURA,
    FORMTYPE.INFORME_SEMESTRAL,
  ],

  TERAPEUTA: [
    FORMTYPE.PLAN_TRABAJO,
    FORMTYPE.INFORME_SEMESTRAL,
    FORMTYPE.ACTAS,
    FORMTYPE.FACTURA,
    FORMTYPE.INFORME_ADMISION,
  ],

  ACOMPANANTE: [FORMTYPE.REPORTE_MENSUAL, FORMTYPE.PLAN_TRABAJO, FORMTYPE.FACTURA],
};

/**
 * Helper para verificar si un rol puede crear un tipo de formulario
 */
export function canCreateForm(role: UserRole, formType: FORMTYPE): boolean {
  return rolePermissions[role]?.includes(formType) ?? false;
}

/**
 * Helper para obtener formularios permitidos por rol
 */
export function getAllowedForms(role: UserRole): FORMTYPE[] {
  return rolePermissions[role] || [];
}

// ========================================
// WORKFLOW HELPERS
// ========================================

export interface WorkflowAction {
  formId: string;
  action: "submit" | "approve" | "reject" | "archive";
  reason?: string; // Obligatorio para reject
}

export interface NotificationData {
  id: string;
  type: "FORM_SUBMITTED" | "FORM_APPROVED" | "FORM_REJECTED" | "FORM_EDITED";
  formId: string;
  formType: FORMTYPE;
  formTitle: string;
  message: string;
  createdAt: string;
  read: boolean;
  metadata?: Record<string, any>;
}
