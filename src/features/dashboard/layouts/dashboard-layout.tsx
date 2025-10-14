"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/shared";
import { CalendarWidget } from "@/features/calendar";
import {
  WelcomeSignatureModal,
  Breadcrumbs,
  Card,
  CardContent,
  Button,
  ProfileCompletionBanner,
} from "@/ui";
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Calendar,
  FileText,
  Users,
  Upload,
  BarChart3,
  Target,
} from "lucide-react";
import colors from "@/lib/colors";
import { AuthService } from "@/lib/auth";
import { apiClient } from "@/lib/api";
import type { User } from "@/types/auth";
import { useAppDispatch } from "@/store";
import { checkAuthThunk } from "@/features/auth/store/authSlice";

interface DashboardLayoutProps {
  userData?: User | null;
  children?: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  role: "terapeuta" | "acompanante" | "coordinador";
}

/**
 * ✅ Optimizado con React.memo
 * Solo re-renderiza si props cambian
 */
export const DashboardLayout = memo(function DashboardLayout({
  userData,
  children,
  currentView,
  onNavigate,
  role,
}: DashboardLayoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // ✅ useMemo: Calcular valores derivados solo cuando userData cambia
  const fullName = useMemo(() => AuthService.getFullName(userData), [userData]);
  const greeting = useMemo(() => AuthService.getGreeting(userData), [userData]);

  // ✅ useMemo: Calcular si mostrar modal solo cuando userData cambia
  const shouldShowWelcomeModal = useMemo(() => {
    return userData?.firstLogin === true && userData?.hasSignature === false;
  }, [userData]);

  // ✅ useMemo: Calcular progreso del perfil
  const profileCompletion = useMemo(() => {
    if (!userData) return { completed: 0, total: 6, percentage: 0 };

    let completed = 0;
    const total = 6;

    if (userData.phone) completed++;
    if (userData.email) completed++;
    if (userData.bio) completed++;
    if (userData.specialty) completed++;
    if (userData.license) completed++;
    if (userData.hasSignature) completed++;

    return { completed, total, percentage: Math.round((completed / total) * 100) };
  }, [userData]);

  const showCompletionBanner = profileCompletion.percentage < 80;

  // ✅ useCallback: Memoizar handler para evitar re-renders de children
  const handleNavigation = useCallback(
    (view: string) => {
      if (view === "perfil") {
        router.push("/perfil");
      } else {
        onNavigate(view);
      }
    },
    [router, onNavigate]
  );

  // ✅ useCallback: Memoizar handler de firma
  const handleSignatureComplete = useCallback(
    async (signature: string, name: string) => {
      try {
        // signature ya es la imagen en Base64 desde el modal
        // Guardar firma en localStorage para uso en PDFs
        localStorage.setItem(
          "userSignature",
          JSON.stringify({
            signature: signature, // Base64 de la imagen
            name,
            timestamp: new Date().toISOString(),
          })
        );

        // Actualizar estado de usuario en Redux con la sesión actualizada
        // uploadSignature ya refrescó el token y obtuvo el perfil actualizado,
        // ahora sincronizamos ese estado con Redux
        await dispatch(checkAuthThunk());

        setShowWelcomeModal(false);
      } catch (error) {
        console.error("Error al guardar la firma:", error);
        throw error;
      }
    },
    [dispatch]
  );

  // ✅ useMemo: Generar breadcrumbs basados en la vista actual
  const breadcrumbs = useMemo(() => {
    const roleLabel = AuthService.getRoleTitle(userData?.role);

    if (currentView === "dashboard") {
      return [{ label: roleLabel, current: true }];
    }

    const viewLabels: Record<string, string> = {
      "plan-trabajo": "Plan de Trabajo",
      "informe-inicial": "Informe Inicial",
      "informe-semestral": "Informe Semestral",
      "reporte-mensual": "Reporte Mensual",
      "seguimiento-acompanantes": "Seguimiento de Acompañantes",
      "seguimiento-flia": "Seguimiento de Familias",
      actas: "Actas de Reunión",
      facturas: "Gestión de Facturas",
    };

    return [
      {
        label: roleLabel,
        onClick: () => onNavigate("dashboard"),
      },
      {
        label: viewLabels[currentView] || currentView,
        current: true,
      },
    ];
  }, [currentView, userData, onNavigate]);

  // ✅ useMemo: Calcular action buttons con iconos mejorados
  const actionButtons = useMemo(() => {
    if (role === "terapeuta") {
      return [
        {
          id: "plan-trabajo",
          title: "Plan de Trabajo",
          icon: Target,
          description: "Crear y gestionar planes de tratamiento",
          color: colors.primary[500],
          bgColor: colors.primary[50],
        },
        {
          id: "informe-inicial",
          title: "Informe Inicial",
          icon: FileText,
          description: "Evaluación inicial del paciente",
          color: colors.secondary[500],
          bgColor: colors.secondary[50],
        },
        {
          id: "informe-semestral",
          title: "Informe Semestral",
          icon: BarChart3,
          description: "Reportes de progreso semestral",
          color: colors.accent[500],
          bgColor: colors.accent[50],
        },
        {
          id: "actas",
          title: "Actas de Reunión",
          icon: Users,
          description: "Registrar reuniones y actas",
          color: colors.success[500],
          bgColor: colors.success[50],
        },
        {
          id: "facturas",
          title: "Gestión de Facturas",
          icon: Upload,
          description: "Subir y gestionar documentos",
          color: colors.warning[500],
          bgColor: colors.warning[50],
        },
      ];
    } else if (role === "coordinador") {
      return [
        {
          id: "informe-inicial",
          title: "Informe Inicial",
          icon: FileText,
          description: "Evaluación inicial del paciente",
          color: colors.secondary[500],
          bgColor: colors.secondary[50],
        },
        {
          id: "informe-semestral",
          title: "Informe Semestral",
          icon: BarChart3,
          description: "Reportes de progreso semestral",
          color: colors.accent[500],
          bgColor: colors.accent[50],
        },
        {
          id: "plan-trabajo",
          title: "Plan de Trabajo",
          icon: Target,
          description: "Crear y gestionar planes de tratamiento",
          color: colors.primary[500],
          bgColor: colors.primary[50],
        },
        {
          id: "seguimiento-acompanantes",
          title: "Seguimiento de Acompañantes",
          icon: Users,
          description: "Supervisar documentos de acompañantes",
          color: colors.error[500],
          bgColor: colors.error[50],
          urgent: true,
        },
        {
          id: "actas",
          title: "Actas de Reunión",
          icon: Users,
          description: "Registrar reuniones y actas",
          color: colors.success[500],
          bgColor: colors.success[50],
        },
        {
          id: "facturas",
          title: "Gestión de Facturas",
          icon: Upload,
          description: "Subir y gestionar documentos",
          color: colors.warning[500],
          bgColor: colors.warning[50],
        },
        {
          id: "reporte-mensual",
          title: "Reporte Mensual",
          icon: Calendar,
          description: "Informes mensuales de seguimiento",
          color: colors.neutral[500],
          bgColor: colors.neutral[50],
        },
      ];
    } else {
      return [
        {
          id: "plan-trabajo",
          title: "Plan de Trabajo",
          icon: Target,
          description: "Crear y gestionar planes de tratamiento",
          color: colors.primary[500],
          bgColor: colors.primary[50],
        },
        {
          id: "reporte-mensual",
          title: "Reporte Mensual",
          icon: Calendar,
          description: "Informes mensuales de seguimiento",
          color: colors.neutral[500],
          bgColor: colors.neutral[50],
        },
        {
          id: "facturas",
          title: "Gestión de Facturas",
          icon: Upload,
          description: "Subir y gestionar documentos",
          color: colors.warning[500],
          bgColor: colors.warning[50],
        },
      ];
    }
  }, [role]);

  // ✅ useEffect: Mostrar modal de bienvenida si es necesario
  useEffect(() => {
    if (shouldShowWelcomeModal) {
      setShowWelcomeModal(true);
    }
  }, [shouldShowWelcomeModal]);

  // Early return DESPUÉS de todos los hooks
  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Modal de Bienvenida con Firma */}
      <WelcomeSignatureModal
        isOpen={showWelcomeModal}
        onComplete={handleSignatureComplete}
        userName={fullName}
        userRole={AuthService.getRoleTitle(userData?.role)}
        userId={userData?.id || ""}
      />

      {/* Solo mostrar navbar si no hay modal de bienvenida */}
      {!showWelcomeModal && <Navbar onNavigate={onNavigate} />}

      {/* Solo mostrar contenido si no hay modal de bienvenida */}
      {!showWelcomeModal && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* ✅ Breadcrumbs persistentes */}
          {currentView !== "dashboard" && (
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbs} showHome={false} />
            </div>
          )}

          {/* ✅ Banner de Completar Perfil */}
          {currentView === "dashboard" && showCompletionBanner && (
            <div className="mb-6">
              <ProfileCompletionBanner
                completeness={profileCompletion.percentage}
                onComplete={() => router.push("/perfil")}
              />
            </div>
          )}

          {currentView === "dashboard" ? (
            <div className="space-y-8">
              {/* Welcome Section con animaciones */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-1 xl:grid-cols-3 gap-8"
              >
                <div className="xl:col-span-2">
                  {/* Header de bienvenida mejorado */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8"
                  >
                    <Card
                      className="shadow-md border-0 rounded-2xl overflow-hidden"
                      style={{
                        backgroundColor: colors.surface,
                        background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.primary[50]} 100%)`,
                      }}
                    >
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                              className="p-3 rounded-2xl"
                              style={{ backgroundColor: colors.primary[50] }}
                            >
                              <Sparkles
                                className="h-8 w-8"
                                style={{ color: colors.primary[500] }}
                              />
                            </motion.div>
                            <div>
                              <h1
                                className="font-display text-2xl lg:text-3xl font-bold mb-2"
                                style={{ color: colors.text }}
                              >
                                {greeting} {fullName.split(" ")[0]}
                              </h1>
                              <p className="text-base" style={{ color: colors.textMuted }}>
                                {AuthService.getRoleTitle(userData?.role)} • Dashboard
                              </p>
                            </div>
                          </div>

                          {/* Indicador de estado */}
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: colors.success[500] }}
                            />
                            <span
                              className="text-sm font-medium"
                              style={{ color: colors.success[700] }}
                            >
                              Activo
                            </span>
                          </div>
                        </div>

                        <p
                          className="text-base leading-relaxed mb-6"
                          style={{ color: colors.textSecondary }}
                        >
                          Bienvenido a tu espacio de trabajo. Aquí puedes gestionar todas tus
                          actividades y hacer seguimiento del progreso de tus{" "}
                          {role === "terapeuta" ? "pacientes" : "estudiantes"}.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Action Buttons Grid mejorado */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {actionButtons.map((section, index) => {
                        const Icon = section.icon;
                        return (
                          <motion.button
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                            className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg text-left ${
                              section.urgent ? "ring-2 ring-offset-2" : ""
                            }`}
                            style={{
                              backgroundColor: colors.surface,
                              borderColor: section.urgent ? colors.error[200] : colors.border,
                              boxShadow: section.urgent
                                ? `0 8px 25px ${colors.error[500]}15`
                                : `0 4px 12px ${colors.shadow}`,
                            }}
                            onClick={() => handleNavigation(section.id)}
                          >
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div
                                  className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
                                  style={{
                                    backgroundColor: section.bgColor,
                                    borderColor: section.color,
                                  }}
                                >
                                  <Icon className="h-6 w-6" style={{ color: section.color }} />
                                </div>
                                {section.urgent && (
                                  <div
                                    className="flex items-center gap-1 px-2 py-1 rounded-full"
                                    style={{ backgroundColor: colors.error[50] }}
                                  >
                                    <AlertCircle
                                      className="h-3 w-3"
                                      style={{ color: colors.error[600] }}
                                    />
                                    <span
                                      className="text-xs font-medium"
                                      style={{ color: colors.error[700] }}
                                    >
                                      Urgente
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3
                                  className="font-semibold text-base mb-2"
                                  style={{ color: colors.text }}
                                >
                                  {section.title}
                                </h3>
                                <p
                                  className="text-sm leading-relaxed line-clamp-2"
                                  style={{ color: colors.textMuted }}
                                >
                                  {section.description}
                                </p>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>

                {/* Panel lateral con calendario */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="xl:col-span-1"
                >
                  <CalendarWidget role={role} onNavigate={handleNavigation} />
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Header de navegación mejorado */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => onNavigate("dashboard")}
                    className="w-fit rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105"
                    style={{
                      color: colors.textMuted,
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al Dashboard
                  </Button>

                  <div className="h-8 w-px" style={{ backgroundColor: colors.border }} />

                  <div>
                    <h1
                      className="font-display text-2xl lg:text-3xl font-bold mb-1"
                      style={{ color: colors.text }}
                    >
                      {currentView === "plan-trabajo" && "Plan de Trabajo"}
                      {currentView === "informe-inicial" && "Informe Inicial"}
                      {currentView === "informe-semestral" && "Informe Semestral"}
                      {currentView === "reporte-mensual" && "Reporte Mensual"}
                      {currentView === "seguimiento-acompanantes" && "Seguimiento de Acompañantes"}
                      {currentView === "seguimiento-flia" && "Seguimiento de Familias"}
                      {currentView === "actas" && "Actas de Reunión"}
                      {currentView === "facturas" && "Gestión de Facturas"}
                    </h1>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      {AuthService.getRoleTitle(userData?.role)} •{" "}
                      {new Date().toLocaleDateString("es-AR")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Content con animación */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                {children}
              </motion.div>
            </motion.div>
          )}
        </main>
      )}
    </div>
  );
});
