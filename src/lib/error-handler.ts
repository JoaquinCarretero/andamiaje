/**
 * Sistema centralizado de manejo de errores
 * Proporciona una forma consistente de manejar errores en toda la aplicación
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Error de conexión') {
    super(message, 503, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

class ErrorHandler {
  /**
   * Maneja un error y lo convierte en AppError
   */
  handle(error: unknown, context?: string): AppError {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${context || 'ErrorHandler'}]`, error);
    }
    
    if (error instanceof AppError) {
      return error;
    }
    
    if (error instanceof Error) {
      return new AppError(error.message, 500, 'UNKNOWN_ERROR');
    }
    
    return new AppError('Error desconocido', 500, 'UNKNOWN_ERROR');
  }

  /**
   * Obtiene un mensaje de error amigable para el usuario
   */
  getUserMessage(error: unknown): string {
    if (error instanceof AuthenticationError) {
      return 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
    }
    
    if (error instanceof ValidationError) {
      return error.message;
    }
    
    if (error instanceof NetworkError) {
      return 'No se puede conectar al servidor. Verifique su conexión a internet.';
    }
    
    if (error instanceof AppError) {
      return error.message;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return 'Ha ocurrido un error inesperado. Por favor, intente nuevamente.';
  }

  /**
   * Determina si se debe mostrar el error al usuario
   */
  shouldShowToUser(error: unknown): boolean {
    if (error instanceof AppError) {
      return error.statusCode < 500;
    }
    return false;
  }

  /**
   * Log del error (se puede integrar con servicio externo como Sentry)
   */
  log(error: unknown, context?: string, additionalInfo?: Record<string, unknown>): void {
    const appError = this.handle(error, context);
    
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrar con servicio de logging (Sentry, LogRocket, etc.)
      console.error({
        message: appError.message,
        statusCode: appError.statusCode,
        code: appError.code,
        context,
        additionalInfo,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error('[Error Log]', {
        error: appError,
        context,
        additionalInfo,
      });
    }
  }
}

export const errorHandler = new ErrorHandler();

/**
 * Hook para usar en componentes React
 * Ejemplo de uso futuro con toast notifications
 */
export function getErrorMessage(error: unknown): string {
  return errorHandler.getUserMessage(error);
}

/**
 * Utility para envolver funciones async y manejar errores
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: string,
  onError?: (error: AppError) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const appError = errorHandler.handle(error, context);
    errorHandler.log(appError, context);
    
    if (onError) {
      onError(appError);
    }
    
    return null;
  }
}

