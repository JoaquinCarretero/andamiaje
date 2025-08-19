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
      title: "Completar Informe",
      description: "Informe semestral de Juan Pérez",
      icon: FileText,
      variant: "secondary" as const,
      urgent: true,
      section: "informe-semestral",
    },
    {
      title: "Registrar Acta",
      description: "Reunión del 15 de enero",
      icon: Users,
      variant: "outline" as const,
      urgent: false,
      section: "actas",
    },
    {
      title: "Subir Factura",
      description: "Factura de diciembre 2024",
      icon: Upload,
      variant: "outline" as const,
      urgent: true,
      section: "facturas",
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border-2 hover:bg-accent/30 hover:border-primary/20 transition-all duration-200"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <action.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <p className="font-medium text-sm truncate">{action.title}</p>
                  {action.urgent && (
                    <Badge variant="destructive" className="text-xs w-fit">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Urgente
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{action.description}</p>
              </div>
            </div>

            <div className="flex-shrink-0 sm:ml-4">
              <Button
                variant={action.variant}
                size="sm"
                onClick={() => onNavigate(action.section)}
                className="w-full sm:w-auto min-w-[60px] hover:scale-105 transition-transform"
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
