"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Trash2, CheckCircle, Calendar, DollarSign } from "lucide-react"

export function InvoiceUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: "Factura_Enero_2024.pdf", size: "245 KB", status: "uploaded", date: "2024-01-31", amount: "$1,200" },
    {
      id: 2,
      name: "Factura_Febrero_2024.pdf",
      size: "198 KB",
      status: "uploaded",
      date: "2024-02-29",
      amount: "$1,200",
    },
  ])

  const monthsStatus = [
    { month: "Enero", status: "uploaded", color: "bg-primary" },
    { month: "Febrero", status: "uploaded", color: "bg-primary" },
    { month: "Marzo", status: "pending", color: "bg-secondary" },
    { month: "Abril", status: "pending", color: "bg-muted" },
    { month: "Mayo", status: "pending", color: "bg-muted" },
    { month: "Junio", status: "pending", color: "bg-muted" },
    { month: "Julio", status: "pending", color: "bg-muted" },
    { month: "Agosto", status: "pending", color: "bg-muted" },
    { month: "Septiembre", status: "pending", color: "bg-muted" },
    { month: "Octubre", status: "pending", color: "bg-muted" },
    { month: "Noviembre", status: "pending", color: "bg-muted" },
    { month: "Diciembre", status: "pending", color: "bg-muted" },
  ]

  const uploadedCount = monthsStatus.filter((m) => m.status === "uploaded").length
  const progress = (uploadedCount / 12) * 100

  return (
    <div className="space-y-6">
      {/* Resumen anual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Resumen de Facturas 2024
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progreso anual</span>
              <span className="text-sm font-medium">{uploadedCount}/12 meses</span>
            </div>
            <Progress value={progress} className="h-3" />

            <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mt-4">
              {monthsStatus.map((month, index) => (
                <div key={index} className="text-center">
                  <div className={`w-8 h-8 rounded-full ${month.color} flex items-center justify-center mb-1`}>
                    {month.status === "uploaded" && <CheckCircle className="h-4 w-4 text-white" />}
                    {month.status === "pending" && <span className="text-xs text-muted-foreground">{index + 1}</span>}
                  </div>
                  <span className="text-xs text-muted-foreground">{month.month.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subir nueva factura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-secondary" />
            Subir Nueva Factura
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-month">Mes de la Factura</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Seleccionar mes</option>
                <option value="marzo">Marzo 2024</option>
                <option value="abril">Abril 2024</option>
                <option value="mayo">Mayo 2024</option>
                <option value="junio">Junio 2024</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice-amount">Monto</Label>
              <Input id="invoice-amount" placeholder="$1,200" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice-description">Descripción (Opcional)</Label>
            <Input id="invoice-description" placeholder="Ej: Sesiones de terapia ocupacional" />
          </div>

          {/* Zona de arrastrar y soltar */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-2">Arrastra tu archivo PDF aquí o</p>
            <Button variant="outline" size="sm">
              Seleccionar archivo
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Solo archivos PDF, máximo 10MB</p>
          </div>

          <Button className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Subir Factura
          </Button>
        </CardContent>
      </Card>

      {/* Facturas subidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Facturas Subidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{file.size}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {file.date}
                      </span>
                      <span className="font-medium text-primary">{file.amount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Subida
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
