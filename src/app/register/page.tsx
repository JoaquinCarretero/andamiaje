"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, CreditCard, Lock, User, Mail, UserPlus, Sparkles } from "lucide-react";
import { Button, Input, Label, Card, CardContent, CardFooter } from "@/ui";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Image from "next/image";
import colors from "@/lib/colors";
import { AuthService } from "@/lib/auth";
import { registerSchema, type RegisterFormData } from "@/features/auth";
import { UserRole } from "@/types/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import { registerThunk, clearError } from "@/features/auth";
import { useToast } from "@/lib/hooks/use-toast";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      documentNumber: "",
      password: "",
      confirmPassword: "",
      role: UserRole.TERAPEUTA,
    },
  });

  // Watch password fields for validation feedback
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // confirmPassword solo se usa para validación, el backend espera RegisterDto sin confirmPassword
      const { firstName, lastName, email, phone, documentNumber, password, role } = data;
      const action = await dispatch(
        registerThunk({ firstName, lastName, email, phone, documentNumber, password, role })
      ).unwrap();
      if (action.user) {
        toast({
          title: "¡Cuenta creada con éxito!",
          description: "Ahora serás redirigido a la página de tu perfil.",
          variant: "success",
        });
        const roleRoute = AuthService.getRoleForRouting(action.user.role);
        router.replace(`/${roleRoute}`);
      }
    } catch (error) {
      console.error("Register error:", error);
      toast({
        title: "Error en el registro",
        description: "Hubo un problema al crear tu cuenta. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: colors.background }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-7xl"
      >
        <Card
          className="border-0 shadow-xl"
          style={{
            backgroundColor: colors.surface,
            boxShadow: `0 20px 40px ${colors.shadowLarge}`,
          }}
        >
          {/* Encabezado */}
          <div className="flex items-center justify-between p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-72 h-36 relative overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center scale-125">
                <Image
                  src="/LogotipoFinalWEBJPEG.png"
                  alt="Andamiaje Logo"
                  fill
                  sizes="288px"
                  className="object-contain scale-150"
                />
              </div>
            </motion.div>

            <div className="text-right space-y-1">
              <h1
                className="text-3xl font-display font-bold flex items-center justify-end gap-2"
                style={{ color: colors.text }}
              >
                <UserPlus className="h-6 w-6" style={{ color: colors.secondary[500] }} />
                Registro
              </h1>
              <p className="text-base" style={{ color: colors.textMuted }}>
                Complete sus datos para unirse a nuestra plataforma
              </p>
            </div>
          </div>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Layout horizontal optimizado - 2 columnas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Datos Personales */}
                <div
                  className="p-6 rounded-lg border-l-4 space-y-4"
                  style={{
                    backgroundColor: colors.primary[50],
                    borderLeftColor: colors.primary[500],
                  }}
                >
                  <h3 className="font-medium text-lg" style={{ color: colors.text }}>
                    Datos Personales
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" style={{ color: colors.text }}>
                          Nombre *
                        </Label>
                        <div className="relative">
                          <User
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                            style={{ color: colors.textMuted }}
                          />
                          <Input
                            id="firstName"
                            placeholder="Juan"
                            {...register("firstName")}
                            className="pl-10 h-12 rounded-lg border-2 transition-all duration-200"
                            style={{
                              backgroundColor: colors.surface,
                              borderColor: errors.firstName ? colors.error[500] : colors.border,
                              color: colors.text,
                            }}
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-sm" style={{ color: colors.error[500] }}>
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName" style={{ color: colors.text }}>
                          Apellido *
                        </Label>
                        <div className="relative">
                          <User
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                            style={{ color: colors.textMuted }}
                          />
                          <Input
                            id="lastName"
                            placeholder="Pérez"
                            {...register("lastName")}
                            className="pl-10 h-12 rounded-lg border-2 transition-all duration-200"
                            style={{
                              backgroundColor: colors.surface,
                              borderColor: errors.lastName ? colors.error[500] : colors.border,
                              color: colors.text,
                            }}
                          />
                        </div>
                        {errors.lastName && (
                          <p className="text-sm" style={{ color: colors.error[500] }}>
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role" style={{ color: colors.text }}>
                          Rol profesional *
                        </Label>
                        <select
                          id="role"
                          {...register("role")}
                          className="flex h-12 w-full rounded-lg border-2 px-3 py-2 text-sm transition-all duration-200"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            color: colors.text,
                          }}
                        >
                          <option value={UserRole.TERAPEUTA}>Terapeuta</option>
                          <option value={UserRole.ACOMPANANTE}>Acompañante Externo</option>
                          <option value={UserRole.COORDINADOR}>Coordinador</option>
                          <option value={UserRole.DIRECTOR}>Director</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" style={{ color: colors.text }}>
                          Correo electrónico *
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
                            {...register("email")}
                            className="pl-10 h-12 rounded-lg border-2 transition-all duration-200"
                            style={{
                              backgroundColor: colors.surface,
                              borderColor: errors.email ? colors.error[500] : colors.border,
                              color: colors.text,
                            }}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-sm" style={{ color: colors.error[500] }}>
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" style={{ color: colors.text }}>
                          Teléfono *
                        </Label>
                        <Controller
                          name="phone"
                          control={control}
                          render={({ field }) => (
                            <PhoneInput
                              country={"ar"}
                              value={field.value}
                              onChange={field.onChange}
                              inputClass="!w-full !h-12 !pl-[48px] !rounded-lg !text-base !border-2"
                              containerClass="!w-full"
                              buttonClass="!border-0 !border-r !rounded-l-lg"
                              inputStyle={{
                                backgroundColor: colors.surface,
                                borderColor: errors.phone ? colors.error[500] : colors.border,
                                color: colors.text,
                              }}
                            />
                          )}
                        />
                        {errors.phone && (
                          <p className="text-sm" style={{ color: colors.error[500] }}>
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credenciales de Acceso */}
                <div
                  className="p-6 rounded-lg border-l-4 space-y-4"
                  style={{
                    backgroundColor: colors.secondary[50],
                    borderLeftColor: colors.secondary[500],
                  }}
                >
                  <h3 className="font-medium text-lg" style={{ color: colors.text }}>
                    Credenciales de Acceso
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="dni" style={{ color: colors.text }}>
                      DNI *
                    </Label>
                    <div className="relative">
                      <CreditCard
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                        style={{ color: colors.textMuted }}
                      />
                      <Input
                        id="dni"
                        placeholder="12345678"
                        {...register("documentNumber")}
                        maxLength={8}
                        className="pl-10 h-12 rounded-lg border-2 transition-all duration-200"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: errors.documentNumber ? colors.error[500] : colors.border,
                          color: colors.text,
                        }}
                      />
                    </div>
                    {errors.documentNumber && (
                      <p className="text-sm" style={{ color: colors.error[500] }}>
                        {errors.documentNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" style={{ color: colors.text }}>
                        Contraseña *
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
                          className="pl-10 pr-12 h-12 rounded-lg border-2 transition-all duration-200"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: errors.password ? colors.error[500] : colors.border,
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
                            <EyeOff className="h-4 w-4" style={{ color: colors.textMuted }} />
                          ) : (
                            <Eye className="h-4 w-4" style={{ color: colors.textMuted }} />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-sm" style={{ color: colors.error[500] }}>
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" style={{ color: colors.text }}>
                        Confirmar Contraseña *
                      </Label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                          style={{ color: colors.textMuted }}
                        />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="**********"
                          {...register("confirmPassword")}
                          className="pl-10 pr-12 h-12 rounded-lg border-2 transition-all duration-200"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: errors.confirmPassword ? colors.error[500] : colors.border,
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
                            <EyeOff className="h-4 w-4" style={{ color: colors.textMuted }} />
                          ) : (
                            <Eye className="h-4 w-4" style={{ color: colors.textMuted }} />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm" style={{ color: colors.error[500] }}>
                          {errors.confirmPassword.message}
                        </p>
                      )}
                      {passwordsMatch && !errors.confirmPassword && (
                        <p
                          className="text-sm flex items-center gap-1"
                          style={{ color: colors.success[600] }}
                        >
                          ✓ Las contraseñas coinciden
                        </p>
                      )}
                    </div>
                  </div>
                </div>
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

              {/* Nota informativa sutil */}
              <div
                className="p-3 rounded-lg border"
                style={{ backgroundColor: colors.primary[50], borderColor: colors.primary[200] }}
              >
                <p className="text-xs text-center" style={{ color: colors.primary[700] }}>
                  💡 Después del registro configurarás tu firma digital para validar documentos
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-lg font-medium text-base transition-all duration-200 hover:scale-105 hover:shadow-medium"
                style={{
                  backgroundColor: colors.secondary[500],
                  color: colors.surface,
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Crear Cuenta
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
  );
}
