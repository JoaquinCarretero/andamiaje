"use client"

import { useState, useRef, useEffect } from "react"
import { PenTool, Check, RotateCcw, Sparkles, Shield, TriangleAlert as AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SignatureCanvas from "react-signature-canvas"
import Image from "next/image"
import colors from "@/lib/colors"
import { apiClient } from "@/lib/api"

interface WelcomeSignatureModalProps {
  isOpen: boolean
  onComplete: (signatureKey: string, name: string) => void
  userName: string
  userRole: string
  userId: string
}

export function WelcomeSignatureModal({ 
  isOpen, 
  onComplete, 
  userName, 
  userRole,
  userId
}: WelcomeSignatureModalProps) {
  const signatureRef = useRef<SignatureCanvas>(null)
  const [hasSignature, setHasSignature] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")

  useEffect(() => {
    if (isOpen) {
      setError("")
      setHasSignature(false)
      setUploadProgress("")
    }
  }, [isOpen])

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear()
      setHasSignature(false)
      setError("")
      setUploadProgress("")
    }
  }

  // Convertir canvas a blob
  const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!)
      }, 'image/png', 0.8)
    })
  }

  const handleConfirm = async () => {
    if (!signatureRef.current) return

    if (signatureRef.current.isEmpty()) {
      setError("Por favor, dibuje su firma para continuar")
      return
    }

    if (!userName.trim()) {
      setError("Error: No se pudo obtener el nombre del usuario")
      return
    }

    setIsSubmitting(true)
    setError("")
    
    try {
      setUploadProgress("Preparando firma...")
      
      // Obtener el canvas y convertirlo a blob
      const canvas = signatureRef.current.getCanvas()
      const blob = await canvasToBlob(canvas)
      
      // Crear archivo desde el blob
      const file = new File([blob], `firma_${userId}_${Date.now()}.png`, { 
        type: 'image/png' 
      })
      
      setUploadProgress("Subiendo firma al servidor...")
      
      // Subir archivo al servidor
      const uploadResponse = await apiClient.uploadSignature(file)
      
      if (!uploadResponse.key) {
        throw new Error("No se recibió la clave del archivo subido")
      }
      
      setUploadProgress("Actualizando perfil...")
      
      // Actualizar perfil del usuario
      await apiClient.updateUserProfile(userId, {
        firstLogin: false,
        hasSignature: true,
        signatureKey: uploadResponse.key
      })
      
      setUploadProgress("Completado")
      
      // Llamar al callback con la key de la firma
      await onComplete(uploadResponse.key, userName.trim())
      
    } catch (error) {
      console.error('Error al guardar la firma:', error)
      setError(error instanceof Error ? error.message : "Error al guardar la firma. Intente nuevamente.")
      setIsSubmitting(false)
      setUploadProgress("")
    }
  }

  const handleSignatureEnd = () => {
    setHasSignature(true)
    setError("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card 
        className="w-full max-w-4xl max-h-[95vh] overflow-y-auto border-0 shadow-2xl"
        style={{ 
          backgroundColor: colors.surface,
          boxShadow: `0 25px 50px ${colors.shadowLarge}`
        }}
      >
        <CardHeader className="text-center pb-6 relative">
          <div className="w-32 h-24 relative mx-auto mb-4">
            <Image
              src="/LogotipoFinalWEBJPEG.png"
              alt="Andamiaje Logo"
              fill
              className="object-contain"
            />
          </div>
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <Sparkles className="h-6 w-6" style={{ color: colors.primary[500] }} />
            <span style={{ color: colors.text }}>¡Bienvenido a Andamiaje!</span>
          </CardTitle>
          <div className="mt-4 space-y-2">
            <p className="text-lg font-medium" style={{ color: colors.text }}>
              Hola {userName || 'Usuario'}
            </p>
            <p className="text-base" style={{ color: colors.textSecondary }}>
              {userRole}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mensaje de bienvenida */}
          <div 
            className="p-6 rounded-lg border-l-4 text-center"
            style={{ 
              backgroundColor: colors.primary[50],
              borderLeftColor: colors.primary[500]
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-8 w-8" style={{ color: colors.primary[500] }} />
              <h3 className="text-xl font-semibold" style={{ color: colors.primary[700] }}>
                Configuración de Seguridad Requerida
              </h3>
            </div>
            <p className="text-base mb-4" style={{ color: colors.primary[600] }}>
              Para garantizar la seguridad y validez legal de sus documentos profesionales, 
              debe registrar su firma digital antes de continuar.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm" style={{ color: colors.primary[600] }}>
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Este paso es obligatorio y se realiza una sola vez</span>
            </div>
          </div>

          {/* Aviso Legal */}
          <div 
            className="p-4 rounded-lg border-l-4"
            style={{ 
              backgroundColor: colors.warning[50],
              borderLeftColor: colors.warning[500]
            }}
          >
            <div className="flex items-start gap-3">
              <PenTool className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: colors.warning[500] }} />
              <div className="text-sm space-y-2">
                <p className="font-medium" style={{ color: colors.warning[700] }}>
                  Declaración de Firma Digital
                </p>
                <p style={{ color: colors.warning[600] }}>
                  Al crear esta firma digital, declaro bajo juramento que:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4" style={{ color: colors.warning[600] }}>
                  <li>Esta es mi firma auténtica y personal</li>
                  <li>Será utilizada exclusivamente por mí para validar documentos profesionales</li>
                  <li>Asumo total responsabilidad por su uso en la plataforma</li>
                  <li>Cualquier uso indebido constituye falsificación de documento público</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Información de Aclaración */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: colors.neutral[50],
              borderColor: colors.border
            }}
          >
            <div className="text-center">
              <p className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                Aclaración de Firma
              </p>
              <p className="text-lg font-semibold" style={{ color: colors.primary[600] }}>
                {userName}
              </p>
              <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                Este nombre aparecerá debajo de su firma en todos los documentos
              </p>
            </div>
          </div>

          {/* Canvas de Firma */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium" style={{ color: colors.text }}>
                Dibuje su firma *
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSignature}
                className="flex items-center gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Limpiar
              </Button>
            </div>
            
            <div 
              className="border-2 rounded-lg overflow-hidden"
              style={{ borderColor: colors.border }}
            >
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 800,
                  height: 250,
                  className: 'signature-canvas w-full h-full bg-white',
                  style: { 
                    width: '100%', 
                    height: '250px',
                    touchAction: 'none'
                  }
                }}
                backgroundColor="white"
                penColor="#1c1917"
                onEnd={handleSignatureEnd}
              />
            </div>
            
            <p className="text-xs text-center" style={{ color: colors.textMuted }}>
              Use su dedo en dispositivos móviles o el mouse/trackpad en computadoras
            </p>
          </div>

          {/* Error */}
          {error && (
            <div 
              className="p-3 rounded-lg border-l-4 flex items-center gap-2"
              style={{ 
                backgroundColor: colors.error[50],
                borderLeftColor: colors.error[500]
              }}
            >
              <AlertTriangle className="h-4 w-4" style={{ color: colors.error[500] }} />
              <p className="text-sm" style={{ color: colors.error[600] }}>
                {error}
              </p>
            </div>
          )}

          {/* Progress */}
          {uploadProgress && (
            <div 
              className="p-3 rounded-lg border-l-4 flex items-center gap-2"
              style={{ 
                backgroundColor: colors.info[50],
                borderLeftColor: colors.info[500]
              }}
            >
              <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm" style={{ color: colors.info[600] }}>
                {uploadProgress}
              </p>
            </div>
          )}

          {/* Botón de Confirmación */}
          <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!hasSignature || !userName.trim() || isSubmitting}
              className="w-full h-14 text-base font-medium"
              style={{
                backgroundColor: colors.primary[500],
                color: colors.surface
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {uploadProgress || "Guardando firma..."}
                </div>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Confirmar Firma y Continuar
                </>
              )}
            </Button>
            <p className="text-xs text-center mt-3" style={{ color: colors.textMuted }}>
              Una vez confirmada, podrá acceder a todas las funcionalidades de la plataforma
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}