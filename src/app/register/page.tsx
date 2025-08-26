'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Chrome, Phone, CreditCard, Sparkles, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Image from 'next/image'
import colors from '@/lib/colors'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [phone, setPhone] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simular registro
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirigir al login después del registro
    router.push('/login')
    setIsLoading(false)
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      style={{ 
        background: `linear-gradient(135deg, ${colors.secondary}15 0%, ${colors.primary}10 50%, ${colors.accent}15 100%)`,
        backgroundColor: colors.background
      }}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: colors.secondary }}
        />
        <div 
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: colors.primary }}
        />
        <div 
          className="absolute top-1/4 right-1/4 w-60 h-60 rounded-full opacity-15 blur-3xl"
          style={{ backgroundColor: colors.accent }}
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-4xl z-10"
      >
        <Card 
          className="backdrop-blur-sm border-0 shadow-large"
          style={{ 
            backgroundColor: `${colors.surface}f5`,
            boxShadow: `0 20px 40px ${colors.shadow}`
          }}
        >
          <CardHeader className="space-y-4 text-center pb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-24 h-24 relative mx-auto mb-4"
            >
              <Image
                src="/LogotipoFinalWEBJPEG.png"
                alt="Andamiaje Logo"
                fill
                className="object-contain"
              />
            </motion.div>
            
            <div className="space-y-2">
              <CardTitle 
                className="text-2xl font-display font-bold flex items-center justify-center gap-2"
                style={{ color: colors.text }}
              >
                <UserPlus className="h-5 w-5" style={{ color: colors.secondary }} />
                Crear cuenta
              </CardTitle>
              <CardDescription 
                className="text-base"
                style={{ color: colors.textMuted }}
              >
                Únete a nuestra plataforma profesional de rehabilitación
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna izquierda */}
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" style={{ color: colors.text }}>
                        Nombre
                      </Label>
                      <div className="relative">
                        <User 
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" 
                          style={{ color: colors.textMuted }}
                        />
                        <Input
                          id="firstName"
                          placeholder="Juan"
                          className="pl-10 h-11 rounded-lg border-2 transition-all duration-200 focus:scale-105"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            color: colors.text
                          }}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" style={{ color: colors.text }}>
                        Apellido
                      </Label>
                      <div className="relative">
                        <User 
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" 
                          style={{ color: colors.textMuted }}
                        />
                        <Input
                          id="lastName"
                          placeholder="Pérez"
                          className="pl-10 h-11 rounded-lg border-2 transition-all duration-200 focus:scale-105"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            color: colors.text
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dni" style={{ color: colors.text }}>
                      DNI
                    </Label>
                    <div className="relative">
                      <CreditCard 
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" 
                        style={{ color: colors.textMuted }}
                      />
                      <Input
                        id="dni"
                        placeholder="12345678"
                        className="pl-10 h-11 rounded-lg border-2 transition-all duration-200 focus:scale-105"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.text
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" style={{ color: colors.text }}>
                      Teléfono
                    </Label>
                    <PhoneInput
                      country={'ar'}
                      value={phone}
                      onChange={phone => setPhone(phone)}
                      inputClass="!w-full !h-11 !pl-[48px] !rounded-lg !text-base !border-2"
                      containerClass="!w-full"
                      buttonClass="!border-0 !border-r !rounded-l-lg"
                      inputStyle={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text
                      }}
                    />
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" style={{ color: colors.text }}>
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <Mail 
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" 
                        style={{ color: colors.textMuted }}
                      />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-10 h-11 rounded-lg border-2 transition-all duration-200 focus:scale-105"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.text
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" style={{ color: colors.text }}>
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock 
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" 
                        style={{ color: colors.textMuted }}
                      />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-12 h-11 rounded-lg border-2 transition-all duration-200 focus:scale-105"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.text
                        }}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" style={{ color: colors.textMuted }} />
                        ) : (
                          <Eye className="h-4 w-4" style={{ color: colors.textMuted }} />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" style={{ color: colors.text }}>
                      Confirmar contraseña
                    </Label>
                    <div className="relative">
                      <Lock 
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" 
                        style={{ color: colors.textMuted }}
                      />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="pl-10 pr-12 h-11 rounded-lg border-2 transition-all duration-200 focus:scale-105"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.text
                        }}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" style={{ color: colors.textMuted }} />
                        ) : (
                          <Eye className="h-4 w-4" style={{ color: colors.textMuted }} />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" style={{ color: colors.text }}>
                      Rol profesional
                    </Label>
                    <select 
                      id="role"
                      className="flex h-11 w-full rounded-lg border-2 px-3 py-2 text-sm transition-all duration-200 focus:scale-105"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text
                      }}
                      required
                    >
                      <option value="">Seleccionar rol</option>
                      <option value="terapeuta">Terapeuta</option>
                      <option value="acompanante">Acompañante Externo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg" style={{ backgroundColor: colors.surfaceSecondary }}>
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-1 rounded border-2 text-primary focus:ring-primary focus:ring-offset-0"
                  style={{ borderColor: colors.border }}
                  required
                />
                <div className="flex-1">
                  <Label htmlFor="terms" className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                    Acepto los{" "}
                    <Link href="/terms" className="font-medium hover:underline transition-colors duration-200" style={{ color: colors.primary }}>
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="/privacy" className="font-medium hover:underline transition-colors duration-200" style={{ color: colors.primary }}>
                      política de privacidad
                    </Link>
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full h-12 rounded-lg font-medium text-base transition-all duration-200 hover:scale-105 hover:shadow-medium"
                  style={{
                    backgroundColor: colors.secondary,
                    color: colors.surface,
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creando cuenta...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Crear cuenta
                    </div>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: colors.border }} />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span 
                      className="bg-card px-2 font-medium"
                      style={{ 
                        backgroundColor: colors.surface,
                        color: colors.textMuted 
                      }}
                    >
                      O regístrate con
                    </span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-sm"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.textSecondary
                  }}
                  onClick={() => {/* Implementar registro con Google */}}
                >
                  <Chrome className="w-5 h-5 mr-2 text-[#4285f4]" />
                  Continuar con Google
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="justify-center pt-6">
            <p className="text-sm" style={{ color: colors.textMuted }}>
              ¿Ya tienes una cuenta?{" "}
              <Link 
                href="/login" 
                className="font-medium hover:underline transition-colors duration-200"
                style={{ color: colors.primary }}
              >
                Inicia sesión aquí
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}