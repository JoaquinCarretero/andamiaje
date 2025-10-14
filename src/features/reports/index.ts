/**
 * Feature: Reports
 *
 * Gestión de todos los tipos de reportes del sistema
 */

// Initial Report
export { InitialReportForm } from "./components/InitialReport/initial-report-form";

// Semester Report
export { default as SemesterReportForm } from "./components/SemesterReport/semester-report-form";

// Monthly Report
export { MonthlyReportForm } from "./components/MonthlyReport/monthly-report-form";

// Work Plan
export { WorkPlanForm } from "./components/WorkPlan/work-plan-form";

// Meeting Minutes
export { MeetingMinutesForm } from "./components/MeetingMinutes/meeting-minutes-form";

// Schemas
export {
  initialReportSchema,
  semesterReportSchema,
  monthlyReportSchema,
  workPlanSchema,
  meetingMinutesSchema,
  type InitialReportFormData,
  type SemesterReportFormData,
  type MonthlyReportFormData,
  type WorkPlanFormData,
  type MeetingMinutesFormData,
} from "./schemas/reports.schema";

// Complete schemas (backend structure) - Complementarios
export {
  actasSpecificDataSchema,
  planTrabajoSpecificDataSchema,
  reporteMensualSpecificDataSchema,
  type ActasFormInput,
  type PlanTrabajoFormInput,
  type ReporteMensualFormInput,
} from "./schemas/complete-reports.schema";

// Utils
export { PDFPreviewModal } from "./utils/pdf-preview-modal";
