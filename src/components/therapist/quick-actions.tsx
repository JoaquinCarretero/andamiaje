"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Users, Upload, Clock, AlertTriangle } from "lucide-react"

interface QuickActionsProps {
  onNavigate: (section: string) => void
}

export function QuickActions({ onNavigate }: QuickActionsProps) {
  const actions = [
    {
      title: "Nuevo Plan de Trabajo",
      description: "Crear plan para nuevo paciente",
      icon: Plus,
      variant: "default" as const,
      urgent: false,
      section: "plan-trabajo",
    },
    {
      title: "Completar Informe Semestral",
      description: "Informe semestral de Juan Pérez",
      icon: FileText,
      variant: "secondary" as const,
      urgent: true,
      section: "informe-semestral",
    },
    {
      title: "Registrar Acta de Reunión",
      description: "Reunión del 15 de enero",
      icon: Users,
      variant: "outline" as const,
      urgent: false,
      section: "actas",
    },
    {
      title: "Subir Factura Mensual",
      description: "Factura de diciembre 2024",
      icon: Upload,
      variant: "outline" as const,
      urgent: true,
      section: "facturas",
    },
  ]

  return (
    <Card className="h-full min-h-[600px]">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Clock className="h-6 w-6 text-primary" />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-5 rounded-xl border-2 hover:bg-accent/30 hover:border-primary/20 transition-all duration-200 min-h-[80px]"
          >
            <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
              <action.icon className="h-5 w-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base leading-tight">{action.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                </div>
                {action.urgent && (
                  <Badge variant="destructive" className="text-xs flex items-center gap-1 flex-shrink-0">
                    <AlertTriangle className="h-3 w-3" />
                    Urgente
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
              <Button
                variant={action.variant}
                size="default"
                onClick={() => onNavigate(action.section)}
                className="min-w-[70px] hover:scale-105 transition-transform"
              >
                Ir
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
