"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DirectorNavbar } from "./director-navbar";
import { DocumentsOverview } from "@/features/documents";
import { UsersOverview } from "@/features/users";
import { Card, CardContent, Breadcrumbs, ProfileCompletionBanner } from "@/ui";
import { FileText, Users, BarChart3, Sparkles, Home, LayoutDashboard } from "lucide-react";
import colors from "@/lib/colors";

import { UserI } from "@/types/auth";
import { AuthService } from "@/lib/auth";

interface DirectorDashboardProps {
  userData: UserI | null;
}

export function DirectorDashboard({ userData }: DirectorDashboardProps) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState("overview");

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const fullName = AuthService.getFullName(userData);
  const greeting = AuthService.getGreeting(userData);

  const getGreeting = () => {
    return greeting;
  };

  const documentTypes = [
    {
      id: "plan-trabajo",
      title: "Planes de Trabajo",
      icon: "📋",
      description: "Gestionar planes terapéuticos",
      count: 15,
    },
    {
      id: "informe-inicial",
      title: "Informes Iniciales",
      icon: "📝",
      description: "Evaluaciones iniciales de pacientes",
      count: 8,
    },
    {
      id: "informe-semestral",
      title: "Informes Semestrales",
      icon: "📊",
      description: "Reportes de progreso semestral",
      count: 12,
    },
    {
      id: "reporte-mensual",
      title: "Reportes Mensuales",
      icon: "📅",
      description: "Informes mensuales de acompañantes",
      count: 24,
    },
    {
      id: "actas",
      title: "Actas de Reunión",
      icon: "👥",
      description: "Registros de reuniones",
      count: 6,
    },
    {
      id: "facturas",
      title: "Facturas",
      icon: "📄",
      description: "Documentos de facturación",
      count: 18,
    },
  ];

  const renderContent = () => {
    switch (currentView) {
      case "documents":
        return <DocumentsOverview />;
      case "users":
        return <UsersOverview />;
      default:
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <Card
              className="shadow-soft border-0"
              style={{
                backgroundColor: colors.surface,
                background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.neutral[50]} 100%)`,
              }}
            >
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Sparkles className="h-6 w-6" style={{ color: colors.primary[500] }} />
                  <h2 className="font-display text-3xl font-bold" style={{ color: colors.text }}>
                    {getGreeting()} {fullName.split(" ")[0]}
                  </h2>
                </div>

                <p className="text-lg mb-8 leading-relaxed" style={{ color: colors.textSecondary }}>
                  Panel de control directivo. Accede rápidamente a cualquier tipo de documento y
                  mantén el control total sobre toda la documentación del centro.
                </p>

                {/* Document Type Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documentTypes.map((docType) => (
                    <button
                      key={docType.id}
                      className="group p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-medium text-left"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      }}
                      onClick={() => {
                        setCurrentView("documents");
                        // Pasar el filtro al componente de documentos
                        setTimeout(() => {
                          const event = new CustomEvent("applyDocumentFilter", {
                            detail: { type: docType.title },
                          });
                          window.dispatchEvent(event);
                        }, 100);
                      }}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div
                            className="text-3xl p-3 rounded-xl border-2 w-fit transition-all duration-300 group-hover:scale-110"
                            style={{
                              backgroundColor: colors.primary[50],
                              borderColor: colors.primary[100],
                            }}
                          >
                            {docType.icon}
                          </div>
                          <span
                            className="text-2xl font-bold"
                            style={{ color: colors.primary[500] }}
                          >
                            {docType.count}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2" style={{ color: colors.text }}>
                            {docType.title}
                          </h3>
                          <p className="text-sm leading-tight" style={{ color: colors.textMuted }}>
                            {docType.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  // Calcular progreso del perfil
  const getProfileCompletion = () => {
    let completed = 0;
    const total = 6;
    
    if (userData.phone) completed++;
    if (userData.email) completed++;
    if (userData.bio) completed++;
    if (userData.specialty) completed++;
    if (userData.license) completed++;
    if (userData.hasSignature) completed++;
    
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const profileCompletion = getProfileCompletion();
  const showCompletionBanner = profileCompletion.percentage < 80;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <DirectorNavbar userData={userData} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/", icon: Home },
              { label: "Dashboard Director", current: true, icon: LayoutDashboard },
            ]}
          />
        </div>

        {/* Banner de Completar Perfil */}
        {showCompletionBanner && (
          <div className="mb-6">
            <ProfileCompletionBanner
              completeness={profileCompletion.percentage}
              onComplete={() => router.push("/perfil")}
            />
          </div>
        )}

        {/* Pestañas de navegación */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div
              className="flex p-1 rounded-xl border"
              style={{
                backgroundColor: colors.neutral[50],
                borderColor: colors.border,
              }}
            >
              <button
                onClick={() => setCurrentView("overview")}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === "overview" ? "shadow-medium" : ""
                }`}
                style={{
                  backgroundColor: currentView === "overview" ? colors.primary[500] : "transparent",
                  color: currentView === "overview" ? colors.surface : colors.textSecondary,
                }}
              >
                <BarChart3 className="h-4 w-4 mr-2 inline" />
                Vista General
              </button>
              <button
                onClick={() => setCurrentView("documents")}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === "documents" ? "shadow-medium" : ""
                }`}
                style={{
                  backgroundColor:
                    currentView === "documents" ? colors.primary[500] : "transparent",
                  color: currentView === "documents" ? colors.surface : colors.textSecondary,
                }}
              >
                <FileText className="h-4 w-4 mr-2 inline" />
                Documentos
              </button>
              <button
                onClick={() => setCurrentView("users")}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === "users" ? "shadow-medium" : ""
                }`}
                style={{
                  backgroundColor: currentView === "users" ? colors.primary[500] : "transparent",
                  color: currentView === "users" ? colors.surface : colors.textSecondary,
                }}
              >
                <Users className="h-4 w-4 mr-2 inline" />
                Usuarios
              </button>
            </div>
          </div>
        </div>

        <div className="animate-slide-in-up">{renderContent()}</div>
      </main>
    </div>
  );
}
