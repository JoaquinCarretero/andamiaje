"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  CreditCard,
  Lock,
  Shield,
  Sparkles,
  Heart,
  Users,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FloatingCard,
  AnimatedBackground,
} from "@/ui";
import Image from "next/image";
import colors from "@/lib/colors";
import { AuthService } from "@/lib/auth";
import { loginSchema, type LoginFormData } from "@/features/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import { loginThunk, clearError } from "@/features/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      documentNumber: "",
      password: "",
    },
  });

  // Limpiar errores globales al cargar la página
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const action = await dispatch(loginThunk(data)).unwrap();
      if (action.user) {
        const roleRoute = AuthService.getRoleForRouting(action.user.role);
        router.replace(`/${roleRoute}`);
      }
    } catch (err) {
      console.error("Login error:", err);
      // El error se manejará a través del estado de Redux
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Imagen y elementos flotantes */}
      <div
        className="hidden lg:flex lg:w-3/5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.primary[500]}20 0%, ${colors.secondary[500]}15 50%, ${colors.accent[500]}20 100%)`,
          backgroundColor: colors.primary[50],
        }}
      >
        {/* Imagen de fondo difuminada */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-110"
          style={{
            backgroundImage:
              "url('/Gemini_Generated_Image_6h9jd6h9jd6h9jd6.png')",
            filter: "blur(2px)",
          }}
        />

        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.primary[500]}40 0%, ${colors.secondary[500]}30 50%, ${colors.accent[500]}40 100%)`,
          }}
        />

        {/* Elementos flotantes animados */}
        <AnimatedBackground />

        {/* Contenido central flotante */}
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-center max-w-lg">
            <FloatingCard delay={200}>
              <div
                className="glass rounded-2xl p-8 backdrop-blur-xl"
                style={{
                  background: `rgba(255, 255, 255, 0.15)`,
                  border: `1px solid rgba(255, 255, 255, 0.2)`,
                  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
                }}
              >
                <motion.h1
                  className="text-4xl font-serif font-bold mb-4"
                  style={{ color: colors.text }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Rehabilitación e Integración Escolar
                </motion.h1>

                <motion.p
                  className="text-lg mb-8 leading-relaxed"
                  style={{ color: colors.textSecondary }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  Potenciar habilidades, construir comunidad y acompañar
                  estudiantes
                </motion.p>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  <FloatingCard delay={1000}>
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: colors.surface,
                        color: colors.text,
                        boxShadow: `0 4px 12px ${colors.shadow}`,
                      }}
                    >
                      <TrendingUp
                        className="w-4 h-4"
                        style={{ color: colors.primary[500] }}
                      />
                      Crecimiento
                    </div>
                  </FloatingCard>

                  <FloatingCard delay={1200}>
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: colors.surface,
                        color: colors.text,
                        boxShadow: `0 4px 12px ${colors.shadow}`,
                      }}
                    >
                      <Heart
                        className="w-4 h-4"
                        style={{ color: colors.secondary[500] }}
                      />
                      Apoyo
                    </div>
                  </FloatingCard>

                  <FloatingCard delay={1400}>
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: colors.surface,
                        color: colors.text,
                        boxShadow: `0 4px 12px ${colors.shadow}`,
                      }}
                    >
                      <Users
                        className="w-4 h-4"
                        style={{ color: colors.accent[500] }}
                      />
                      Aprendizaje
                    </div>
                  </FloatingCard>

                  <FloatingCard delay={1600}>
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: colors.surface,
                        color: colors.text,
                        boxShadow: `0 4px 12px ${colors.shadow}`,
                      }}
                    >
                      <Target
                        className="w-4 h-4"
                        style={{ color: colors.success[500] }}
                      />
                      Trabajo en equipo
                    </div>
                  </FloatingCard>
                </motion.div>

                <motion.p
                  className="text-sm mt-8 opacity-80"
                  style={{ color: colors.textMuted }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                >
                  Trabajamos en un entorno terapéutico con un toque de color y
                  alegría para cada día.
                </motion.p>
              </div>
            </FloatingCard>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario de login */}
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
              boxShadow: `0 20px 40px ${colors.shadowLarge}`,
            }}
          >
            <CardHeader className="space-y-4 text-center pb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-64 h-40 relative mx-auto mb-0 overflow-hidden"
              >
                <Image
                  src="/LogotipoFinalWEBJPEG.png"
                  alt="Andamiaje Logo"
                  fill
                  sizes="256px"
                  className="object-contain scale-150"
                />
              </motion.div>

              <div className="space-y-2">
                <CardTitle
                  className="text-2xl font-display font-bold flex items-center justify-center gap-2"
                  style={{ color: colors.text }}
                >
                  <Sparkles
                    className="h-5 w-5"
                    style={{ color: colors.primary[500] }}
                  />
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
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                autoComplete="off"
              >
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
                      type="text"
                      placeholder="12345678"
                      {...register("documentNumber")}
                      maxLength={8}
                      autoComplete="off"
                      className="pl-10 h-12 rounded-lg border-2 transition-all duration-200"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: errors.documentNumber
                          ? colors.error[500]
                          : colors.border,
                        color: colors.text,
                      }}
                    />
                  </div>
                  {errors.documentNumber && (
                    <p
                      className="text-sm mt-1"
                      style={{ color: colors.error[500] }}
                    >
                      {errors.documentNumber.message}
                    </p>
                  )}
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
                      placeholder="**********"
                      {...register("password")}
                      autoComplete="new-password"
                      className="pl-10 pr-12 h-12 rounded-lg border-2 transition-all duration-200"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: errors.password
                          ? colors.error[500]
                          : colors.border,
                        color: colors.text,
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-md"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff
                          className="h-4 w-4"
                          style={{ color: colors.textMuted }}
                        />
                      ) : (
                        <Eye
                          className="h-4 w-4"
                          style={{ color: colors.textMuted }}
                        />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p
                      className="text-sm mt-1"
                      style={{ color: colors.error[500] }}
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div
                    className="p-3 rounded-lg border-l-4 flex items-center gap-2"
                    style={{
                      backgroundColor: colors.error[50],
                      borderLeftColor: colors.error[500],
                    }}
                  >
                    <p className="text-sm" style={{ color: colors.error[600] }}>
                      {error}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Link
                    href="/forgot-password"
                    className="text-sm hover:underline transition-colors duration-200"
                    style={{ color: colors.primary[500] }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-lg font-medium text-base transition-all duration-200 hover:scale-105 hover:shadow-medium"
                  style={{
                    backgroundColor: colors.primary[500],
                    color: colors.surface,
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
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
            </CardContent>

            <CardFooter className="justify-center pt-6">
              <p className="text-sm" style={{ color: colors.textMuted }}>
                ¿No tienes una cuenta?{" "}
                <Link
                  href="/register"
                  className="font-medium hover:underline transition-colors duration-200"
                  style={{ color: colors.primary[500] }}
                >
                  Regístrate aquí
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
