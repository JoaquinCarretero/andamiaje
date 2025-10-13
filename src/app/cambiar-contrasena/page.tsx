"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Key, Eye, EyeOff, Shield, CircleCheck as CheckCircle, Home, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Breadcrumbs, ConfirmationDialog } from "@/ui";
import { Navbar } from "@/shared";
import colors from "@/lib/colors";
import { useAppSelector } from "@/store";
import { changePasswordSchema, type ChangePasswordFormData } from "@/features/auth";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, isAuthenticated, initialized } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<ChangePasswordFormData | null>(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!initialized) return;

    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    setIsLoading(false);
  }, [initialized, isAuthenticated, user, router]);

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    // Mostrar diálogo de confirmación antes de cambiar
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmedChange = async () => {
    if (!pendingData) return;
    
    setShowConfirmDialog(false);
    // Simular cambio de contraseña
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push("/perfil");
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;

    return strength;
  };

  const newPassword = watch("newPassword");
  const passwordStrength = getPasswordStrength(newPassword || "");

  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/", icon: Home },
              { label: "Perfil", href: "/perfil", icon: UserIcon },
              { label: "Cambiar Contraseña", current: true },
            ]}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-fit rounded-lg transition-all duration-200 hover:shadow-sm"
            style={{
              color: colors.textSecondary,
              backgroundColor: colors.neutral[50],
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Perfil
          </Button>

          <h1 className="font-display text-3xl font-bold" style={{ color: colors.text }}>
            Cambiar Contraseña
          </h1>
        </div>

        <div className="animate-slide-in-up">
          <Card className="shadow-soft border-0" style={{ backgroundColor: colors.surface }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" style={{ color: colors.primary[500] }} />
                <span style={{ color: colors.text }}>Seguridad de la Cuenta</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Contraseña Actual */}
                <div className="space-y-2">
                  <Label htmlFor="current-password" style={{ color: colors.text }}>
                    Contraseña Actual *
                  </Label>
                  <div className="relative">
                    <Key
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                      style={{ color: colors.textMuted }}
                    />
                    <Input
                      id="current-password"
                      type={showPasswords.current ? "text" : "password"}
                      placeholder="Ingrese su contraseña actual"
                      {...register("currentPassword")}
                      className="pl-10 pr-12 h-12"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: errors.currentPassword ? colors.error[500] : colors.border,
                        color: colors.text,
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
                      onClick={() => togglePasswordVisibility("current")}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4" style={{ color: colors.textMuted }} />
                      ) : (
                        <Eye className="h-4 w-4" style={{ color: colors.textMuted }} />
                      )}
                    </Button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm" style={{ color: colors.error[500] }}>
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* Nueva Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="new-password" style={{ color: colors.text }}>
                    Nueva Contraseña *
                  </Label>
                  <div className="relative">
                    <Key
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                      style={{ color: colors.textMuted }}
                    />
                    <Input
                      id="new-password"
                      type={showPasswords.new ? "text" : "password"}
                      placeholder="Ingrese su nueva contraseña"
                      {...register("newPassword")}
                      className="pl-10 pr-12 h-12"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: errors.newPassword ? colors.error[500] : colors.border,
                        color: colors.text,
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
                      onClick={() => togglePasswordVisibility("new")}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" style={{ color: colors.textMuted }} />
                      ) : (
                        <Eye className="h-4 w-4" style={{ color: colors.textMuted }} />
                      )}
                    </Button>
                  </div>

                  {/* Indicador de fortaleza */}
                  {newPassword && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: colors.textMuted }}>Fortaleza de la contraseña</span>
                        <span style={{ color: colors.textMuted }}>{passwordStrength}%</span>
                      </div>
                      <div
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: colors.neutral[100] }}
                      >
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${passwordStrength}%`,
                            backgroundColor:
                              passwordStrength < 50
                                ? colors.error[500]
                                : passwordStrength < 75
                                ? colors.warning[500]
                                : colors.success[500],
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {errors.newPassword && (
                    <p className="text-sm" style={{ color: colors.error[500] }}>
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" style={{ color: colors.text }}>
                    Confirmar Nueva Contraseña *
                  </Label>
                  <div className="relative">
                    <Key
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                      style={{ color: colors.textMuted }}
                    />
                    <Input
                      id="confirm-password"
                      type={showPasswords.confirm ? "text" : "password"}
                      placeholder="Confirme su nueva contraseña"
                      {...register("confirmPassword")}
                      className="pl-10 pr-12 h-12"
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
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
                      onClick={() => togglePasswordVisibility("confirm")}
                    >
                      {showPasswords.confirm ? (
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
                </div>

                {/* Recomendaciones de Seguridad */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.primary[50] }}>
                  <h4 className="font-medium mb-2" style={{ color: colors.primary[700] }}>
                    Recomendaciones de Seguridad:
                  </h4>
                  <ul className="text-sm space-y-1" style={{ color: colors.primary[600] }}>
                    <li>• Use al menos 8 caracteres</li>
                    <li>• Incluya mayúsculas y minúsculas</li>
                    <li>• Agregue números y símbolos</li>
                    <li>• Evite información personal</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: colors.primary[500],
                    color: colors.surface,
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Cambiando contraseña...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Cambiar Contraseña
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Diálogo de Confirmación para Cambio de Contraseña */}
        <ConfirmationDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleConfirmedChange}
          onCancel={() => {
            setShowConfirmDialog(false);
            setPendingData(null);
          }}
          title="¿Confirmar cambio de contraseña?"
          description="Su sesión se cerrará automáticamente después del cambio. Deberá iniciar sesión nuevamente con su nueva contraseña."
          confirmText="Cambiar Contraseña"
          cancelText="Cancelar"
        />
      </main>
    </div>
  );
}
