"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge, useConfirmation, PDFPreviewModal } from "@/ui"
import { Upload, FileText, Trash2, CheckCircle, Calendar, AlertCircle, Eye } from "lucide-react"
import colors from "@/lib/colors"

export function InvoiceUpload() {
  const { confirm, ConfirmDialog } = useConfirmation();
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    month: "",
    description: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState({ month: "", year: "" });

  useEffect(() => {
    const storedFiles = localStorage.getItem("uploadedInvoices");
    if (storedFiles) {
      setUploadedFiles(JSON.parse(storedFiles));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("uploadedInvoices", JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.month) {
      newErrors.month = "Debe seleccionar el mes"
    }
    if (!selectedFile) {
      newErrors.file = "Debe seleccionar un archivo"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm() && selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        const newFile = {
          id: Date.now(),
          name: selectedFile.name,
          month: formData.month,
          uploadDate: new Date().toISOString().split('T')[0],
          size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
          file: reader.result,
        }
        setUploadedFiles([...uploadedFiles, newFile])
        setFormData({ month: "", description: "" })
        setSelectedFile(null)
      }
    }
  }

  const removeFile = async (id: number) => {
    const confirmed = await confirm({
      title: "¿Eliminar factura?",
      description: "Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      type: "danger",
    });

    if (confirmed) {
      setUploadedFiles(uploadedFiles.filter(file => file.id !== id))
    }
  }

  const viewFile = (file: File | string) => {
    if (typeof file === 'string') {
      setPreviewUrl(file);
    } else {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  return (
    <div className="space-y-6">
      {/* Subir nueva factura */}
      <Card 
        className="shadow-soft border-0"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" style={{ color: colors.primary[500] }} />
            <span style={{ color: colors.text }}>Subir Factura Mensual</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-month" style={{ color: colors.text }}>
                  Mes de la Factura *
                </Label>
                <select 
                  id="invoice-month"
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                  className={`flex h-11 w-full rounded-md border px-3 py-2 text-sm transition-all duration-200 ${errors.month ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: errors.month ? colors.error[500] : colors.border,
                    color: colors.text
                  }}
                >
                  <option value="">Seleccionar mes</option>
                  {Array.from({ length: 3 }, (_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - i);
                    return date;
                  }).map(date => {
                    const monthYear = date.toLocaleString('es-AR', { month: 'long', year: 'numeric' });
                    return <option key={monthYear} value={monthYear}>{monthYear}</option>
                  })}
                </select>
                {errors.month && (
                  <div className="flex items-center gap-1 text-sm" style={{ color: colors.error[500] }}>
                    <AlertCircle className="h-4 w-4" />
                    {errors.month}
                  </div>
                )}
              </div>
            </div>

            {/* Zona de arrastrar y soltar */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 hover:border-primary/50 ${selectedFile ? 'bg-primary-50 border-primary-500' : ''}`}
              style={{ borderColor: errors.file ? colors.error[500] : colors.border }}
            >
              <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept="application/pdf" />
              <Upload className="h-12 w-12 mx-auto mb-4" style={{ color: selectedFile ? colors.primary[500] : colors.textMuted }} />
              <p className={`text-sm mb-2 font-medium ${selectedFile ? 'text-primary-700' : 'text-textMuted'}`}>
                {selectedFile ? selectedFile.name : "Arrastra tu archivo PDF aquí o"}
              </p>
              <Button variant="outline" size="sm" type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                Seleccionar archivo
              </Button>
              <p className="text-xs mt-2" style={{ color: colors.textMuted }}>
                Solo archivos PDF, máximo 10MB
              </p>
              {errors.file && (
                <div className="flex items-center justify-center gap-1 text-sm mt-2" style={{ color: colors.error[500] }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.file}
                </div>
              )}
            </div>

            <Button 
              type="submit"
              className="w-full h-11"
              style={{
                backgroundColor: colors.primary[500],
                color: colors.surface
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir Factura
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Facturas subidas */}
      <Card 
        className="shadow-soft border-0"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" style={{ color: colors.secondary[500] }} />
            <span style={{ color: colors.text }}>Facturas Subidas</span>
          </CardTitle>
          <div className="flex gap-2">
            <select value={filter.month} onChange={e => setFilter({ ...filter, month: e.target.value })} className="flex h-9 w-full rounded-md border px-3 py-1 text-sm transition-all duration-200" style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}>
              <option value="">Filtrar por mes</option>
              {Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('es-AR', { month: 'long' })).map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select value={filter.year} onChange={e => setFilter({ ...filter, year: e.target.value })} className="flex h-9 w-full rounded-md border px-3 py-1 text-sm transition-all duration-200" style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}>
              <option value="">Filtrar por año</option>
              {Array.from({ length: new Date().getFullYear() - 2022 }, (_, i) => 2023 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {uploadedFiles.filter(file => {
            if (filter.month && !file.month.toLowerCase().includes(filter.month.toLowerCase())) return false;
            if (filter.year && !file.month.includes(filter.year)) return false;
            return true;
          }).length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4" style={{ color: colors.textMuted }} />
              <p className="text-sm" style={{ color: colors.textMuted }}>
                No hay facturas que coincidan con los filtros
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadedFiles.filter(file => {
                if (filter.month && !file.month.toLowerCase().includes(filter.month.toLowerCase())) return false;
                if (filter.year && !file.month.includes(filter.year)) return false;
                return true;
              }).map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg transition-colors duration-200 hover:bg-muted/50"
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-md"
                      style={{ backgroundColor: colors.primary[50] }}
                    >
                      <FileText className="h-5 w-5" style={{ color: colors.primary[500] }} />
                    </div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: colors.text }}>
                        {file.month}
                      </p>
                      <div className="flex items-center gap-4 text-xs" style={{ color: colors.textMuted }}>
                        <span>{file.size}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {file.uploadDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewFile(file.file as File)}
                      disabled={!file.file}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFile(file.id)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <PDFPreviewModal
        isOpen={!!previewUrl}
        onClose={() => setPreviewUrl(null)}
        title="Vista Previa de Factura"
        pdfUrl={previewUrl || ""}
      />
      <ConfirmDialog />
    </div>
  )
}