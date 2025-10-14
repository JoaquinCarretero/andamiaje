"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Loader2, XCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import colors from "@/lib/colors";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface SaveIndicatorProps {
  status: SaveStatus;
  lastSaved?: Date;
  errorMessage?: string;
  className?: string;
}

/**
 * Indicador visual del estado de guardado de formularios
 * Muestra feedback claro al usuario sobre el estado de sus cambios
 *
 * Uso:
 * ```tsx
 * const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
 * const [lastSaved, setLastSaved] = useState<Date>()
 *
 * <SaveIndicator status={saveStatus} lastSaved={lastSaved} />
 * ```
 */
export function SaveIndicator({
  status,
  lastSaved,
  errorMessage,
  className = "",
}: SaveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>("");

  // Actualizar "hace X minutos" cada minuto
  useEffect(() => {
    if (!lastSaved) return;

    const updateTimeAgo = () => {
      const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);

      if (seconds < 60) {
        setTimeAgo("hace un momento");
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setTimeAgo(`hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`);
      } else {
        const hours = Math.floor(seconds / 3600);
        setTimeAgo(`hace ${hours} ${hours === 1 ? "hora" : "horas"}`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [lastSaved]);

  const getStatusConfig = () => {
    switch (status) {
      case "saving":
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" style={{ color: colors.info[500] }} />,
          text: "Guardando...",
          color: colors.info[500],
          bgColor: colors.info[50],
        };
      case "saved":
        return {
          icon: <CheckCircle className="h-4 w-4" style={{ color: colors.success[500] }} />,
          text: lastSaved ? `Guardado ${timeAgo}` : "Guardado correctamente",
          color: colors.success[600],
          bgColor: colors.success[50],
        };
      case "error":
        return {
          icon: <XCircle className="h-4 w-4" style={{ color: colors.error[500] }} />,
          text: errorMessage || "Error al guardar",
          color: colors.error[600],
          bgColor: colors.error[50],
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" style={{ color: colors.textMuted }} />,
          text: "Sin guardar",
          color: colors.textMuted,
          bgColor: colors.neutral[50],
        };
    }
  };

  const config = getStatusConfig();

  return (
    <AnimatePresence mode="wait">
      {status !== "idle" && (
        <motion.div
          key={status}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${className}`}
          style={{
            backgroundColor: config.bgColor,
            color: config.color,
          }}
        >
          {config.icon}
          <span>{config.text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook personalizado para manejar auto-save con debounce
 *
 * Uso:
 * ```tsx
 * const { saveStatus, triggerSave } = useAutoSave({
 *   onSave: async (data) => {
 *     await api.saveForm(data)
 *   },
 *   debounceMs: 2000
 * })
 * ```
 */
export function useAutoSave<T>(config: {
  onSave: (data: T) => Promise<void>;
  debounceMs?: number;
  onError?: (error: Error) => void;
}) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const triggerSave = async (data: T) => {
    try {
      setSaveStatus("saving");
      setErrorMessage(undefined);

      await config.onSave(data);

      setSaveStatus("saved");
      setLastSaved(new Date());

      // Volver a idle después de 3 segundos
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (error) {
      setSaveStatus("error");
      const message = error instanceof Error ? error.message : "Error desconocido";
      setErrorMessage(message);
      config.onError?.(error as Error);

      // Volver a idle después de 5 segundos
      setTimeout(() => {
        setSaveStatus("idle");
      }, 5000);
    }
  };

  return {
    saveStatus,
    lastSaved,
    errorMessage,
    triggerSave,
  };
}
