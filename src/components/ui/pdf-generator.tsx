"use client"

import { StoredSignature } from "@/lib/signature-storage"
import colors from "@/lib/colors"

interface PDFContentProps {
  title: string
  patientName: string
  professionalName: string
  date: string
  content: React.ReactNode
  signature?: StoredSignature | null
}

export function PDFContent({ 
  title, 
  patientName, 
  professionalName, 
  date, 
  content, 
  signature 
}: PDFContentProps) {
  return (
    <div 
      className="bg-white p-8 min-h-[297mm]"
      style={{ 
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        lineHeight: '1.6',
        color: '#000000',
        fontSize: '14px',
        letterSpacing: '0.5px'
      }}
    >
      {/* Header del documento */}
      <div className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: colors.primary[500] }}>
        <div className="w-32 h-24 relative mx-auto mb-4">
          <img
            src="/LogotipoFinalWEBJPEG.png"
            alt="Andamiaje Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.primary[500], letterSpacing: '0.8px' }}>
          ANDAMIAJE - CENTRO DE REHABILITACIÓN
        </h1>
        <h2 className="text-xl font-semibold" style={{ color: colors.text, letterSpacing: '0.6px' }}>
          {title}
        </h2>
      </div>

      {/* Información del documento */}
      <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded">
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
      <div className="mb-16">
        {content}
      </div>

      {/* Firma */}
      {signature && (
        <div className="mt-16 pt-8 border-t-2" style={{ borderColor: colors.border }}>
          <div className="flex justify-center">
            <div className="flex items-end gap-16 w-full max-w-2xl">
              <div className="flex-1 text-center">
                <div className="border-b-2 pb-4 mb-3 h-20 flex items-end justify-center" style={{ borderColor: colors.text }}>
                  <img 
                    src={signature.signature} 
                    alt="Firma digital" 
                    className="max-h-16 max-w-full object-contain"
                  />
                </div>
                <p className="text-sm font-medium">Firma del Profesional</p>
              </div>
              <div className="flex-1 text-center">
                <div className="border-b-2 pb-4 mb-3 h-20 flex items-end justify-center" style={{ borderColor: colors.text }}>
                  <p className="text-sm font-medium">{signature.name}</p>
                </div>
                <p className="text-sm font-medium">Aclaración</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
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
  )
}