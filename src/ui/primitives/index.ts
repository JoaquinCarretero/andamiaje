/**
 * UI Components - Design System
 *
 * Componentes de interfaz reutilizables
 */

// Primitives
export { Button } from "./button";
export { Input, type InputProps } from "./input";
export { Textarea, type TextareaProps } from "./textarea";
export { Label } from "./label";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card";
export { Badge } from "./badge";
export { Progress } from "./progress";

// UX Enhancement Components (Nuevos)
export { SaveIndicator, useAutoSave } from "./save-indicator";
export type { SaveStatus } from "./save-indicator";
export { Breadcrumbs, BreadcrumbsMobile, useBreadcrumbs } from "./breadcrumbs";
export type { BreadcrumbItem } from "./breadcrumbs";
export { ConfirmationDialog, useConfirmation } from "./confirmation-dialog";
export type { ConfirmationType } from "./confirmation-dialog";
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog";

// Modals & Overlays
export { SignatureModal } from "./signature-modal";
export { WelcomeSignatureModal } from "./welcome-signature-modal";
export { NotificationsModal } from "./notifications-modal";
export { ProfileCompletionBanner } from "./profile-completion-banner";
export { ProfileEditModal } from "./profile-edit-modal";

// Complex Components
export { Sidebar } from "./sidebar";

// Floating & Animation Components
export { FloatingCard, FloatingIcon, AnimatedBackground } from "./floating-elements";

// Tooltip
export { Tooltip } from "./tooltip";
