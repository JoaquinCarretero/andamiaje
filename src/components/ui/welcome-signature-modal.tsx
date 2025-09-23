"use client"

import { useState, useRef, useEffect } from "react"
import { PenTool, Check, RotateCcw, Sparkles, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SignatureCanvas from "react-signature-canvas"
import Image from "next/image"
import colors from "@/lib/colors"

interface WelcomeSignatureModalProps {
  isOpen: boolean
  onComplete: (signature: string, name: string) => void
  userName: string
  userRole: string
}

export function WelcomeSignatureModal({ 
  isOpen, 
  onComplete, 
  userName, 
  userRole 
}: WelcomeSignatureModalProps) {
  const signatureRef = useRef<SignatureCanvas>(null)
  const [signatureName, setSignatureName] = useState(userName)
  const [hasSignature, setHasSignature] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setSignatureName(userName)
  }, [userName])

  useEffect(() => {
    if (isOpen) {
      setError("")
      setHasSignature(false)
    }
  }, [isOpen])

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear()
      setHasSignature(false)
      setError("")
    }
  }

  const handleConfirm = async () => {
    if (!signatureRef.current) return

    if (signatureRef.current.isEmpty()) {
      setError("Por favor, dibuje su firma para continuar")
      return
    }

    if (!signatureName.trim()) {
      setError("Por favor, ingrese su nombre y apellido para la aclaración")
      return
    }

    setIsSubmitting(true)
    
    try {
      const signatureData = signatureRef.current.toDataURL()
      await onComplete(signatureData, signatureName.trim())
    } catch (error) {
      setError("Error al guardar la firma. Intente nuevamente.")
      setIsSubmitting(false)
    }
  }

  const handleSignatureEnd = () => {
    setHasSignature(true)
    setError("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card 
        className="w-full max-w-4xl max-h-[95vh] overflow-y-auto border-0 shadow-2xl"
        style={{ 
          backgroundColor: colors.surface,
          boxShadow: `0 25px 50px ${colors.shadowLarge}`
        }}
      >
        <CardHeader className="text-center pb-6">
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
              Hola {userName}
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

          {/* Campo de Aclaración */}
          <div className="space-y-2">
            <Label htmlFor="signature-name" style={{ color: colors.text }}>
              Aclaración de Firma (Nombre y Apellido) *
            </Label>
            <Input
              id="signature-name"
              placeholder="Ej: Dr. María González López"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              className="h-12 rounded-lg border-2"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text
              }}
            />
            <p className="text-xs" style={{ color: colors.textMuted }}>
              Este nombre aparecerá debajo de su firma en todos los documentos
            </p>
          </div>

          {/* Canvas de Firma */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label style={{ color: colors.text }}>
                Dibuje su firma *
              </Label>
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

          {/* Botón de Confirmación */}
          <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!hasSignature || !signatureName.trim() || isSubmitting}
              className="w-full h-14 text-base font-medium"
              style={{
                backgroundColor: colors.primary[500],
                color: colors.surface
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando firma...
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