"use client"

import { useState, useRef, useEffect } from "react"
import { X, RotateCcw, Check, PenTool } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import SignatureCanvas from "react-signature-canvas"
import colors from "@/lib/colors"

interface SignatureModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (signature: string, name: string) => void
  initialName?: string
}

export function SignatureModal({ isOpen, onClose, onConfirm, initialName = "" }: SignatureModalProps) {
  const signatureRef = useRef<SignatureCanvas>(null)
  const [signatureName, setSignatureName] = useState(initialName)
  const [hasSignature, setHasSignature] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setSignatureName(initialName)
  }, [initialName])

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

  const handleConfirm = () => {
    if (!signatureRef.current) return

    if (signatureRef.current.isEmpty()) {
      setError("Por favor, dibuje su firma")
      return
    }

    if (!signatureName.trim()) {
      setError("Por favor, ingrese su nombre y apellido para la aclaración")
      return
    }

    const signatureData = signatureRef.current.toDataURL()
    onConfirm(signatureData, signatureName.trim())
  }

  const handleSignatureEnd = () => {
    setHasSignature(true)
    setError("")
  }

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
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl"
        style={{ 
          backgroundColor: colors.surface,
          boxShadow: `0 25px 50px ${colors.shadowLarge}`
        }}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5" style={{ color: colors.accent[500] }} />
              <span style={{ color: colors.text }}>Firma Digital</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
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
                  width: 600,
                  height: 200,
                  className: 'signature-canvas w-full h-full bg-white',
                  style: { 
                    width: '100%', 
                    height: '200px',
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
              <X className="h-4 w-4" style={{ color: colors.error[500] }} />
              <p className="text-sm" style={{ color: colors.error[600] }}>
                {error}
              </p>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex justify-between pt-4 border-t" style={{ borderColor: colors.border }}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              style={{
                borderColor: colors.border,
                color: colors.textSecondary
              }}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!hasSignature || !signatureName.trim()}
              style={{
                backgroundColor: colors.accent[500],
                color: colors.surface
              }}
            >
              <Check className="h-4 w-4 mr-2" />
              Confirmar Firma
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}