/**
 * Hook: useAutoSaveForm
 * 
 * Auto-guardado inteligente para formularios con React Hook Form
 * 
 * Características:
 * - Debounce configurable (default: 2 segundos)
 * - Solo guarda si el formulario está "dirty"
 * - Maneja estados: idle, saving, saved, error
 * - Compatible con SaveIndicator component
 * 
 * Uso:
 * ```typescript
 * const form = useForm<MyFormData>({ resolver: zodResolver(mySchema) });
 * 
 * const { saveStatus, lastSaved } = useAutoSaveForm(form, {
 *   onSave: async (data) => {
 *     await apiClient.saveDraft(data);
 *   },
 *   debounceMs: 2000,
 *   enabled: true,
 * });
 * 
 * <SaveIndicator status={saveStatus} lastSaved={lastSaved} />
 * ```
 */

import { useEffect, useState, useRef } from 'react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';
import type { SaveStatus } from '@/ui';

export interface UseAutoSaveFormOptions<T> {
  /** Función que guarda los datos (debe ser async) */
  onSave: (data: T) => Promise<void>;
  
  /** Tiempo de debounce en milisegundos (default: 2000) */
  debounceMs?: number;
  
  /** Habilitar/deshabilitar auto-save (default: true) */
  enabled?: boolean;
  
  /** Callback cuando ocurre un error */
  onError?: (error: Error) => void;
  
  /** Callback cuando se guarda exitosamente */
  onSuccess?: () => void;
}

export interface UseAutoSaveFormReturn {
  /** Estado actual del guardado */
  saveStatus: SaveStatus;
  
  /** Última vez que se guardó */
  lastSaved: Date | undefined;
  
  /** Forzar guardado inmediato */
  forceSave: () => Promise<void>;
  
  /** Mensaje de error si hay alguno */
  errorMessage: string | undefined;
}

export function useAutoSaveForm<T extends FieldValues>(
  form: UseFormReturn<T>,
  options: UseAutoSaveFormOptions<T>
): UseAutoSaveFormReturn {
  const {
    onSave,
    debounceMs = 2000,
    enabled = true,
    onError,
    onSuccess,
  } = options;

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date>();
  const [errorMessage, setErrorMessage] = useState<string>();
  
  // Ref para evitar guardados duplicados
  const isSavingRef = useRef(false);
  
  // Watch todos los valores del formulario
  const values = form.watch();

  /**
   * Función interna de guardado
   */
  const performSave = async () => {
    // Evitar guardados concurrentes
    if (isSavingRef.current) return;
    
    // Solo guardar si hay cambios
    if (!form.formState.isDirty) {
      setSaveStatus('idle');
      return;
    }

    try {
      isSavingRef.current = true;
      setSaveStatus('saving');
      setErrorMessage(undefined);

      // Ejecutar guardado
      await onSave(values);

      // Éxito
      setSaveStatus('saved');
      setLastSaved(new Date());
      
      // Reset del dirty state manteniendo valores
      form.reset(values, { keepValues: true });
      
      // Callback de éxito
      onSuccess?.();

      // Volver a idle después de 2 segundos
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
      
    } catch (error) {
      // Error
      const errorMsg = error instanceof Error ? error.message : 'Error al guardar';
      setErrorMessage(errorMsg);
      setSaveStatus('error');
      
      // Callback de error
      onError?.(error instanceof Error ? error : new Error(errorMsg));
      
      // Volver a idle después de 5 segundos
      setTimeout(() => {
        setSaveStatus('idle');
      }, 5000);
      
    } finally {
      isSavingRef.current = false;
    }
  };

  /**
   * Efecto de auto-save con debounce
   */
  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      performSave();
    }, debounceMs);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, enabled, debounceMs]);

  /**
   * Función para forzar guardado inmediato
   */
  const forceSave = async () => {
    await performSave();
  };

  return {
    saveStatus,
    lastSaved,
    forceSave,
    errorMessage,
  };
}

