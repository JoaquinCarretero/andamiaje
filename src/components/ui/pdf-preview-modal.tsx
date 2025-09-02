"use client"

import { useState, useRef } from "react"
import { X, Download, FileText, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import colors from "@/lib/colors"

interface PDFPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: React.ReactNode
  patientName?: string
  professionalName?: string
  date?: string
}

export function PDFPreviewModal({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  patientName = "",
  professionalName = "",
  date = ""
}: PDFPreviewModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Obtener firma del localStorage
  const getStoredSignature = () => {
    try {
      const stored = localStorage.getItem('userSignature')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  const generatePDF = async () => {
    if (!contentRef.current) return

    setIsGenerating(true)
    
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const fileName = `${title.replace(/\s+/g, '_')}_${patientName.replace(/\s+/g, '_')}_${date}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('Error generando PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const storedSignature = getStoredSignature()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden border-0 shadow-2xl"
        style={{ 
          backgroundColor: colors.surface,
          boxShadow: `0 25px 50px ${colors.shadowLarge}`
        }}
      >
        <CardHeader className="pb-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" style={{ color: colors.primary[500] }} />
              <span style={{ color: colors.text }}>Vista Previa - {title}</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={generatePDF}
                disabled={isGenerating}
                style={{
                  backgroundColor: colors.primary[500],
                  color: colors.surface
                }}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generando...
                  </div>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div 
              ref={contentRef}
              className="p-8 bg-white"
              style={{ 
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                lineHeight: '1.6',
                color: '#000000',
                letterSpacing: '0.3px'
              }}
            >
              {/* Header del documento */}
              <div className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: colors.primary[500] }}>
                <div className="w-32 h-24 relative mx-auto mb-4">
                  <Image
                    src="/LogotipoFinalWEBJPEG.png"
                    alt="Andamiaje Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: colors.primary[500] }}>
                  ANDAMIAJE - CENTRO DE REHABILITACIÓN
                </h1>
                <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
                  {title}
                </h2>
              </div>

              {/* Información del documento */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paciente:</p>
                  <p className="font-semibold">{patientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Fecha:</p>
                  <p className="font-semibold">{date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Profesional:</p>
                  <p className="font-semibold">{professionalName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Documento:</p>
                  <p className="font-semibold">{title}</p>
                </div>
              </div>

              {/* Contenido del documento */}
              <div className="mb-12">
                {content}
              </div>

              {/* Firma */}
              {storedSignature && (
                <div className="mt-12 pt-8 border-t-2" style={{ borderColor: colors.border }}>
                  <div className="flex justify-center">
                    <div className="text-center w-80">
                      <div className="border-b-2 pb-4 mb-3 h-20 flex items-end justify-center" style={{ borderColor: colors.text }}>
                        <img 
                          src={storedSignature.signature} 
                          alt="Firma digital" 
                          className="max-h-16 max-w-full object-contain"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Firma del Profesional</p>
                        <p className="text-xs text-gray-600">{storedSignature.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                      Documento firmado digitalmente el {new Date().toLocaleDateString('es-AR')} a las {new Date().toLocaleTimeString('es-AR')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Esta firma digital tiene validez legal según la Ley 25.506 de Firma Digital
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}