"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/ui";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import colors from "@/lib/colors";
import { errorHandler } from "@/lib/error-handler";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary para capturar errores en el árbol de componentes
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    errorHandler.log(error, "ErrorBoundary", {
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={{ backgroundColor: colors.background }}
        >
          <Card
            className="max-w-2xl w-full shadow-xl border-0"
            style={{ backgroundColor: colors.surface }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-3 rounded-full" style={{ backgroundColor: colors.error[50] }}>
                  <AlertCircle className="h-6 w-6" style={{ color: colors.error[500] }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                    ¡Ups! Algo salió mal
                  </h2>
                  <p className="text-sm font-normal mt-1" style={{ color: colors.textMuted }}>
                    No te preocupes, estamos trabajando en solucionarlo
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div
                  className="p-4 rounded-lg border-l-4"
                  style={{
                    backgroundColor: colors.error[50],
                    borderLeftColor: colors.error[500],
                  }}
                >
                  <h3 className="font-semibold mb-2" style={{ color: colors.error[700] }}>
                    Error Details (Development Only):
                  </h3>
                  <pre className="text-xs overflow-auto" style={{ color: colors.error[600] }}>
                    {this.state.error.message}
                    {this.state.errorInfo && `\n\n${this.state.errorInfo.componentStack}`}
                  </pre>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={this.handleReset}
                  className="flex-1"
                  style={{
                    backgroundColor: colors.primary[500],
                    color: colors.surface,
                  }}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Intentar Nuevamente
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1"
                  style={{
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Ir al Inicio
                </Button>
              </div>

              <p className="text-sm text-center" style={{ color: colors.textMuted }}>
                Si el problema persiste, por favor contacte al soporte técnico.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
