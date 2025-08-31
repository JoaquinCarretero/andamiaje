"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, CreditCard, Lock, User, Mail, UserPlus, Sparkles, Stethoscope, GraduationCap, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FloatingCard, FloatingIcon, AnimatedBackground } from "@/components/ui/floating-elements"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import Image from "next/image"
import colors from "@/lib/colors"

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
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Imagen y elementos flotantes */}
      <div 
        className="hidden lg:flex lg:w-3/5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.secondary[500]}20 0%, ${colors.accent[500]}15 50%, ${colors.primary[500]}20 100%)`,
          backgroundColor: colors.secondary[50]
        }}
      >
        {/* Imagen de fondo difuminada - aquí puedes poner tu imagen */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            filter: "blur(2px)"
          }}
        />
        
        {/* Overlay gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.secondary[500]}40 0%, ${colors.accent[500]}30 50%, ${colors.primary[500]}40 100%)`
          }}
        />

        {/* Elementos flotantes animados */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingIcon
            icon={
              <div 
                className="w-16 h-16 rounded-full opacity-20"
                style={{ backgroundColor: colors.secondary[300] }}
              />
            }
            className="top-32 left-24"
            delay={0}
            duration={4500}
          />
          <FloatingIcon
            icon={
              <div 
                className="w-20 h-20 rounded-full opacity-15"
                style={{ backgroundColor: colors.accent[300] }}
              />
            }
            className="top-20 right-40"
            delay={1500}
            duration={5500}
          />
          <FloatingIcon
            icon={
              <div 
                className="w-12 h-12 rounded-full opacity-25"
                style={{ backgroundColor: colors.primary[300] }}
              />
            }
            className="bottom-40 left-32"
            delay={2500}
            duration={4000}
          />
        </div>

        {/* Contenido central flotante */}
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-center max-w-lg">
            <FloatingCard delay={200}>
              <div 
                className="glass rounded-2xl p-8 backdrop-blur-xl"
                style={{
                  background: `rgba(255, 255, 255, 0.15)`,
                  border: `1px solid rgba(255, 255, 255, 0.2)`,
                  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`
                }}
              >
                <motion.h1 
                  className="text-4xl font-serif font-bold mb-4"
                  style={{ color: colors.text }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Únete a Nuestro Equipo
                </motion.h1>
                
                <motion.p 
                  className="text-lg mb-8 leading-relaxed"
                  style={{ color: colors.textSecondary }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  Forma parte de una comunidad dedicada al crecimiento y desarrollo integral
                </motion.p>

                <motion.div 
                  className="grid grid-cols-1 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  <FloatingCard delay={1000}>
                    <div 
                      className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: colors.surface,
                        color: colors.text,
                        boxShadow: `0 4px 12px ${colors.shadow}`
                      }}
                    >
                      <Stethoscope className="w-4 h-4" style={{ color: colors.primary[500] }} />
                      Profesionales de la Salud
                    </div>
                  </FloatingCard>
                  
                  <FloatingCard delay={1200}>
                    <div 
                      className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: colors.surface,
                        color: colors.text,
                        boxShadow: `0 4px 12px ${colors.shadow}`
                      }}
                    >
                      <GraduationCap className="w-4 h-4" style={{ color: colors.secondary[500] }} />
                      Acompañantes Educativos
                    </div>
                  </FloatingCard>
                  
                  <FloatingCard delay={1400}>
                    <div 
                      className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: colors.surface,
                        color: colors.text,
                        boxShadow: `0 4px 12px ${colors.shadow}`
                      }}
                    >
                      <BookOpen className="w-4 h-4" style={{ color: colors.accent[500] }} />
                      Especialistas en Desarrollo
                    </div>
                  </FloatingCard>
                </motion.div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario de registro */}
      <div 
        className="w-full lg:w-2/5 flex items-center justify-center p-8"
        style={{ backgroundColor: colors.background }}
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card 
            className="border-0 shadow-xl"
            style={{ 
              backgroundColor: colors.surface,
              boxShadow: `0 20px 40px ${colors.shadowLarge}`
            }}
          >
            <CardHeader className="space-y-4 text-center pb-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-24 h-18 relative mx-auto mb-4"
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
                  <UserPlus className="h-5 w-5" style={{ color: colors.secondary[500] }} />
                  Crear cuenta
                </CardTitle>
                <CardDescription 
                  className="text-base"
                  style={{ color: colors.textMuted }}
                >
                  Únete a nuestra plataforma profesional
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
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

                <div 
                  className="flex items-start space-x-3 p-4 rounded-lg" 
                  style={{ backgroundColor: colors.neutral[50] }}
                >
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
                      <Link href="/terms" className="font-medium hover:underline transition-colors duration-200" style={{ color: colors.primary[500] }}>
                        términos y condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link href="/privacy" className="font-medium hover:underline transition-colors duration-200" style={{ color: colors.primary[500] }}>
                        política de privacidad
                      </Link>
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-lg font-medium text-base transition-all duration-200 hover:scale-105 hover:shadow-medium"
                  style={{
                    backgroundColor: colors.secondary[500],
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
              </form>
            </CardContent>

            <CardFooter className="justify-center pt-6">
              <p className="text-sm" style={{ color: colors.textMuted }}>
                ¿Ya tienes una cuenta?{" "}
                <Link 
                  href="/login" 
                  className="font-medium hover:underline transition-colors duration-200"
                  style={{ color: colors.primary[500] }}
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}