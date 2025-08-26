"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Chrome, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import colors from "@/lib/colors";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular autenticación
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Redirigir al dashboard del terapeuta por defecto
    router.push('/terapeuta');
    setIsLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      style={{ 
        background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}10 50%, ${colors.accent}15 100%)`,
        backgroundColor: colors.background
      }}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: colors.primary }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: colors.secondary }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: colors.accent }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md z-10"
      >
        <Card 
          className="backdrop-blur-sm border-0 shadow-large"
          style={{ 
            backgroundColor: `${colors.surface}f5`,
            boxShadow: `0 20px 40px ${colors.shadow}`
          }}
        >
          <CardHeader className="space-y-4 text-center pb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-32 h-32 relative mx-auto mb-4"
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
                <Sparkles className="h-5 w-5" style={{ color: colors.primary }} />
                ¡Bienvenido de nuevo!
              </CardTitle>
              <CardDescription 
                className="text-base"
                style={{ color: colors.textMuted }}
              >
                Accede a tu espacio de trabajo profesional
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="pl-10 h-12 rounded-lg border-2 transition-all duration-200 focus:scale-105"
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
                    className="pl-10 pr-12 h-12 rounded-lg border-2 transition-all duration-200 focus:scale-105"
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
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-md"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-2 text-primary focus:ring-primary focus:ring-offset-0"
                    style={{ borderColor: colors.border }}
                  />
                  <span className="text-sm" style={{ color: colors.textMuted }}>
                    Recordarme
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm hover:underline transition-colors duration-200"
                  style={{ color: colors.primary }}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-lg font-medium text-base transition-all duration-200 hover:scale-105 hover:shadow-medium"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.surface,
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Iniciar sesión
                  </div>
                )}
              </Button>
            </form>

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
                  O continúa con
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
              onClick={() => {
                // Implementar login con Google
              }}
            >
              <Chrome className="w-5 h-5 mr-2 text-[#4285f4]" />
              Continuar con Google
            </Button>
          </CardContent>

          <CardFooter className="justify-center pt-6">
            <p className="text-sm" style={{ color: colors.textMuted }}>
              ¿No tienes una cuenta?{" "}
              <Link
                href="/register"
                className="font-medium hover:underline transition-colors duration-200"
                style={{ color: colors.primary }}
              >
                Regístrate aquí
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Enlaces de demostración */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 text-center space-y-3"
        >
          <p className="text-sm font-medium" style={{ color: colors.textMuted }}>
            Acceso rápido para demostración:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/terapeuta" 
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: colors.primary,
                color: colors.surface
              }}
            >
              Demo Terapeuta
            </Link>
            <Link 
              href="/acompanante" 
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: colors.secondary,
                color: colors.surface
              }}
            >
              Demo Acompañante
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}