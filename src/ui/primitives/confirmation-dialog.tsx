"use client";

import { useState } from "react";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import colors from "@/lib/colors";

export type ConfirmationType = "danger" | "warning" | "info" | "success";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  type?: ConfirmationType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  requiresTyping?: boolean;
  requiredText?: string;
  showIcon?: boolean;
}

/**
 * Diálogo de confirmación accesible con soporte para acciones destructivas
 *
 * Características:
 * - Diferentes tipos visuales (danger, warning, info, success)
 * - Opción de requerir escritura para acciones críticas
 * - Totalmente accesible con ARIA
 * - Bloqueo de acción hasta confirmación
 *
 * Uso básico:
 * ```tsx
 * const [showDialog, setShowDialog] = useState(false)
 *
 * <ConfirmationDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   title="¿Eliminar documento?"
 *   description="Esta acción no se puede deshacer."
 *   type="danger"
 *   onConfirm={handleDelete}
 * />
 * ```
 *
 * Con confirmación por escritura:
 * ```tsx
 * <ConfirmationDialog
 *   requiresTyping
 *   requiredText="ELIMINAR"
 *   type="danger"
 *   {...props}
 * />
 * ```
 */
export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  type = "warning",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  requiresTyping = false,
  requiredText = "CONFIRMAR",
  showIcon = true,
}: ConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [typedText, setTypedText] = useState("");

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onOpenChange(false);
      setTypedText("");
    } catch (error) {
      console.error("Error en confirmación:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
    setTypedText("");
  };

  const isConfirmDisabled = requiresTyping ? typedText !== requiredText : isLoading;

  const getTypeConfig = () => {
    switch (type) {
      case "danger":
        return {
          icon: <AlertTriangle className="h-6 w-6" />,
          iconColor: colors.error[500],
          iconBg: colors.error[50],
          buttonStyle: {
            backgroundColor: colors.error[500],
            color: colors.surface,
          },
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-6 w-6" />,
          iconColor: colors.warning[500],
          iconBg: colors.warning[50],
          buttonStyle: {
            backgroundColor: colors.warning[500],
            color: colors.surface,
          },
        };
      case "info":
        return {
          icon: <Info className="h-6 w-6" />,
          iconColor: colors.info[500],
          iconBg: colors.info[50],
          buttonStyle: {
            backgroundColor: colors.info[500],
            color: colors.surface,
          },
        };
      case "success":
        return {
          icon: <CheckCircle className="h-6 w-6" />,
          iconColor: colors.success[500],
          iconBg: colors.success[50],
          buttonStyle: {
            backgroundColor: colors.success[500],
            color: colors.surface,
          },
        };
    }
  };

  const config = getTypeConfig();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          {showIcon && (
            <div
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4"
              style={{ backgroundColor: config.iconBg }}
            >
              <div style={{ color: config.iconColor }}>{config.icon}</div>
            </div>
          )}
          <AlertDialogTitle className="text-center" style={{ color: colors.text }}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center" style={{ color: colors.textSecondary }}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {requiresTyping && (
          <div className="py-4">
            <label
              htmlFor="confirm-input"
              className="text-sm font-medium block mb-2"
              style={{ color: colors.text }}
            >
              Escribe{" "}
              <span className="font-mono font-bold" style={{ color: config.iconColor }}>
                {requiredText}
              </span>{" "}
              para confirmar:
            </label>
            <input
              id="confirm-input"
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg font-mono"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
                color: colors.text,
              }}
              placeholder={requiredText}
              autoComplete="off"
              autoFocus
            />
          </div>
        )}

        <AlertDialogFooter className="flex justify-between w-full">
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isLoading}
            style={{
              borderColor: colors.border,
              color: colors.textSecondary,
            }}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            style={config.buttonStyle}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * Hook para manejar confirmaciones de forma declarativa
 *
 * Uso:
 * ```tsx
 * const { confirm, ConfirmDialog } = useConfirmation()
 *
 * const handleDelete = async () => {
 *   const confirmed = await confirm({
 *     title: "¿Eliminar?",
 *     description: "Esta acción no se puede deshacer",
 *     type: "danger"
 *   })
 *
 *   if (confirmed) {
 *     // Proceder con eliminación
 *   }
 * }
 *
 * return (
 *   <>
 *     <button onClick={handleDelete}>Eliminar</button>
 *     <ConfirmDialog />
 *   </>
 * )
 * ```
 */
export function useConfirmation() {
  const [config, setConfig] = useState<Omit<
    ConfirmationDialogProps,
    "open" | "onOpenChange" | "onConfirm"
  > | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = (
    options: Omit<ConfirmationDialogProps, "open" | "onOpenChange" | "onConfirm">
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig(options);
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    resolver?.(true);
    setConfig(null);
    setResolver(null);
  };

  const handleCancel = () => {
    resolver?.(false);
    setConfig(null);
    setResolver(null);
  };

  const ConfirmDialog = () => {
    if (!config) return null;

    return (
      <ConfirmationDialog
        {...config}
        open={!!config}
        onOpenChange={(open) => {
          if (!open) handleCancel();
        }}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  };

  return {
    confirm,
    ConfirmDialog,
  };
}

/**
 * Componente de alerta de diálogo base de shadcn/ui
 * Incluido aquí para referencia - normalmente ya estaría en el proyecto
 */
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
};
