"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  Key,
  LogOut,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Home,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Label,
  Input,
  Textarea,
  Breadcrumbs,
  ConfirmationDialog,
} from "@/ui";
import { Navbar } from "@/shared";
import { useSignature, StoredSignature } from "@/lib/signature-storage";
import colors from "@/lib/colors";
import { AuthService } from "@/lib/auth";
import { apiClient } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { logoutThunk, checkAuthThunk } from "@/features/auth";
import { useToast } from "@/lib/hooks/use-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { getSignature } = useSignature();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, initialized, loading } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  // Estados
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [localSignature, setLocalSignature] = useState<StoredSignature | null>(null);
  const [signatureError, setSignatureError] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    phone: "",
    bio: "",
    specialty: "",
    license: "",
    experience: "",
  });

  // Memoizar la key de la firma del servidor
  const serverSignatureKey = useMemo(() => {
    return user?.digitalSignature || user?.signatureKey || null;
  }, [user?.digitalSignature, user?.signatureKey]);

  // Memoizar la carga de la firma local
  const loadLocalSignature = useCallback(() => {
    const sig = getSignature();
    setLocalSignature(sig);
  }, [getSignature]);

  // Cargar datos del usuario
  useEffect(() => {
    if (!initialized) return;

    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    // Cargar firma del servidor
    if (serverSignatureKey && !signatureUrl) {
      const fetchSignedUrl = async () => {
        try {
          const url = await apiClient.fetchSignedUrl(serverSignatureKey);
          setSignatureUrl(url);
          setSignatureError(false);
        } catch (error) {
          console.error("Error obteniendo URL firmada:", error);
          setSignatureError(true);
          loadLocalSignature();
        }
      };
      fetchSignedUrl();
    } else if (!serverSignatureKey && !localSignature) {
      loadLocalSignature();
    }

    // Cargar datos del formulario
    setFormData({
      phone: user.phone || "",
      bio: user.bio || "",
      specialty: user.specialty || "",
      license: user.license || "",
      experience: user.experience || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, isAuthenticated, serverSignatureKey, router]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await apiClient.updateUserProfile(user.id, formData);
      await dispatch(checkAuthThunk()).unwrap();
      setIsEditing(false);
      toast({
        title: "¡Perfil actualizado!",
        description: "Tus datos han sido guardados correctamente.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error al actualizar",
        description: "No se pudieron guardar los cambios. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        phone: user.phone || "",
        bio: user.bio || "",
        specialty: user.specialty || "",
        license: user.license || "",
        experience: user.experience || "",
      });
    }
    setIsEditing(false);
  };

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    try {
      await dispatch(logoutThunk()).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const getRoleColor = (role: string) => {
    const roleMap: Record<string, { bg: string; text: string; border: string }> = {
      TERAPEUTA: { bg: colors.primary[50], text: colors.primary[600], border: colors.primary[200] },
      COORDINADOR: {
        bg: colors.secondary[50],
        text: colors.secondary[600],
        border: colors.secondary[200],
      },
      ACOMPANANTE: { bg: colors.accent[50], text: colors.accent[600], border: colors.accent[200] },
    };
    return (
      roleMap[role] || {
        bg: colors.neutral[50],
        text: colors.neutral[600],
        border: colors.neutral[200],
      }
    );
  };

  if (!initialized || loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: colors.primary[500] }}
        />
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return null;
  }

  const fullName = AuthService.getFullName(user);
  const roleTitle = AuthService.getRoleTitle(user.role);
  const roleColors = getRoleColor(user.role);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/", icon: Home },
              { label: "Mi Perfil", current: true },
            ]}
          />
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="w-fit rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105"
                style={{
                  color: colors.textMuted,
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
            <div className="text-right">
              <h1
                className="font-display text-3xl lg:text-4xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                Mi Perfil
              </h1>
              <p className="text-base" style={{ color: colors.textMuted }}>
                Administra tu información personal y profesional
              </p>
            </div>
            {!isEditing && (
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push("/cambiar-contrasena")}
                  variant="outline"
                  className="rounded-xl h-11 transition-all duration-200 hover:shadow-md"
                  style={{
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Cambiar Contraseña
                </Button>

                <Button
                  onClick={() => setShowLogoutDialog(true)}
                  variant="outline"
                  className="rounded-xl h-11 transition-all duration-200 hover:shadow-md"
                  style={{
                    borderColor: colors.error[300],
                    color: colors.error[600],
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                className="shadow-md border-0 rounded-2xl"
                style={{ backgroundColor: colors.surface }}
              >
                <CardHeader className="pb-4 border-b" style={{ borderColor: colors.border }}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-xl"
                        style={{ backgroundColor: colors.primary[50] }}
                      >
                        <User className="h-5 w-5" style={{ color: colors.primary[500] }} />
                      </div>
                      <span className="text-lg font-semibold" style={{ color: colors.text }}>
                        Información Personal
                      </span>
                    </CardTitle>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="rounded-xl hover:shadow-md transition-all duration-200"
                        style={{
                          borderColor: colors.primary[200],
                          color: colors.primary[600],
                        }}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div className="space-y-2">
                      <Label
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        <User className="h-4 w-4" />
                        Nombre Completo
                      </Label>
                      <div
                        className="h-12 px-4 py-3 rounded-xl border-2 flex items-center"
                        style={{
                          backgroundColor: colors.neutral[50],
                          borderColor: colors.border,
                          color: colors.text,
                        }}
                      >
                        <span className="font-medium">{fullName}</span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        <Mail className="h-4 w-4" />
                        Correo Electrónico
                      </Label>
                      <div
                        className="h-12 px-4 py-3 rounded-xl border-2 flex items-center"
                        style={{
                          backgroundColor: colors.neutral[50],
                          borderColor: colors.border,
                          color: colors.text,
                        }}
                      >
                        <span className="font-medium">{user.email}</span>
                      </div>
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        <Phone className="h-4 w-4" />
                        Teléfono
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Ingrese su teléfono"
                          className="h-12 rounded-xl"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.primary[200],
                            color: colors.text,
                          }}
                        />
                      ) : (
                        <div
                          className="h-12 px-4 py-3 rounded-xl border-2 flex items-center"
                          style={{
                            backgroundColor: user.phone ? colors.success[50] : colors.warning[50],
                            borderColor: user.phone ? colors.success[200] : colors.warning[200],
                            color: colors.text,
                          }}
                        >
                          {user.phone ? (
                            <>
                              <CheckCircle
                                className="h-4 w-4 mr-2"
                                style={{ color: colors.success[600] }}
                              />
                              <span className="font-medium">{user.phone}</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle
                                className="h-4 w-4 mr-2"
                                style={{ color: colors.warning[600] }}
                              />
                              <span
                                className="text-sm font-medium"
                                style={{ color: colors.warning[700] }}
                              >
                                No especificado
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Rol */}
                    <div className="space-y-2">
                      <Label
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        <Shield className="h-4 w-4" />
                        Rol Profesional
                      </Label>
                      <div className="h-12 flex items-center">
                        <Badge
                          className="px-4 py-2 text-sm font-semibold rounded-xl shadow-sm"
                          style={{
                            backgroundColor: roleColors.bg,
                            color: roleColors.text,
                            border: `2px solid ${roleColors.border}`,
                          }}
                        >
                          {roleTitle}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Información Profesional */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card
                className="shadow-md border-0 rounded-2xl"
                style={{ backgroundColor: colors.surface }}
              >
                <CardHeader className="pb-4 border-b" style={{ borderColor: colors.border }}>
                  <CardTitle className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: colors.secondary[50] }}
                    >
                      <Briefcase className="h-5 w-5" style={{ color: colors.secondary[500] }} />
                    </div>
                    <span className="text-lg font-semibold" style={{ color: colors.text }}>
                      Información Profesional
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Especialidad */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="specialty"
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        <GraduationCap className="h-4 w-4" />
                        Especialidad
                      </Label>
                      {isEditing ? (
                        <Input
                          id="specialty"
                          value={formData.specialty}
                          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                          placeholder="Ej: Terapia Ocupacional"
                          className="h-12 rounded-xl"
                        />
                      ) : (
                        <div
                          className="h-12 px-4 py-3 rounded-xl border-2 flex items-center"
                          style={{
                            backgroundColor: user.specialty
                              ? colors.success[50]
                              : colors.warning[50],
                            borderColor: user.specialty ? colors.success[200] : colors.warning[200],
                            color: colors.text,
                          }}
                        >
                          {user.specialty ? (
                            <>
                              <CheckCircle
                                className="h-4 w-4 mr-2"
                                style={{ color: colors.success[600] }}
                              />
                              <span className="font-medium">{user.specialty}</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle
                                className="h-4 w-4 mr-2"
                                style={{ color: colors.warning[600] }}
                              />
                              <span
                                className="text-sm font-medium"
                                style={{ color: colors.warning[700] }}
                              >
                                No especificada
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Matrícula */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="license"
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        <Award className="h-4 w-4" />
                        Matrícula Profesional
                      </Label>
                      {isEditing ? (
                        <Input
                          id="license"
                          value={formData.license}
                          onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                          placeholder="Ej: MP 12345"
                          className="h-12 rounded-xl"
                        />
                      ) : (
                        <div
                          className="h-12 px-4 py-3 rounded-xl border-2 flex items-center"
                          style={{
                            backgroundColor: user.license ? colors.success[50] : colors.warning[50],
                            borderColor: user.license ? colors.success[200] : colors.warning[200],
                            color: colors.text,
                          }}
                        >
                          {user.license ? (
                            <>
                              <CheckCircle
                                className="h-4 w-4 mr-2"
                                style={{ color: colors.success[600] }}
                              />
                              <span className="font-medium">{user.license}</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle
                                className="h-4 w-4 mr-2"
                                style={{ color: colors.warning[600] }}
                              />
                              <span
                                className="text-sm font-medium"
                                style={{ color: colors.warning[700] }}
                              >
                                No especificada
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Fecha de Ingreso */}
                    <div className="space-y-2">
                      <Label
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        <Calendar className="h-4 w-4" />
                        Fecha de Ingreso
                      </Label>
                      <div
                        className="h-12 px-4 py-3 rounded-xl border-2 flex items-center"
                        style={{
                          backgroundColor: colors.primary[50],
                          borderColor: colors.primary[200],
                          color: colors.text,
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" style={{ color: colors.primary[600] }} />
                        <span className="font-medium">
                          {user.joinDate
                            ? new Date(user.joinDate).toLocaleDateString("es-AR")
                            : new Date(user.createdAt).toLocaleDateString("es-AR")}
                        </span>
                      </div>
                    </div>

                    {/* Experiencia */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="experience"
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        <Briefcase className="h-4 w-4" />
                        Años de Experiencia
                      </Label>
                      {isEditing ? (
                        <Input
                          id="experience"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          placeholder="Ej: 5 años"
                          className="h-12 rounded-xl"
                        />
                      ) : (
                        <div
                          className="h-12 px-4 py-3 rounded-xl border-2 flex items-center"
                          style={{
                            backgroundColor: user.experience
                              ? colors.success[50]
                              : colors.warning[50],
                            borderColor: user.experience
                              ? colors.success[200]
                              : colors.warning[200],
                            color: colors.text,
                          }}
                        >
                          {user.experience ? (
                            <>
                              <CheckCircle
                                className="h-4 w-4 mr-2"
                                style={{ color: colors.success[600] }}
                              />
                              <span className="font-medium">{user.experience}</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle
                                className="h-4 w-4 mr-2"
                                style={{ color: colors.warning[600] }}
                              />
                              <span
                                className="text-sm font-medium"
                                style={{ color: colors.warning[700] }}
                              >
                                No especificada
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Biografía */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="bio"
                      className="flex items-center gap-2 text-sm font-medium"
                      style={{ color: colors.text }}
                    >
                      <GraduationCap className="h-4 w-4" />
                      Biografía Profesional
                    </Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Describa su experiencia, especialidades y enfoque profesional..."
                        className="min-h-[120px] rounded-xl resize-none"
                      />
                    ) : (
                      <div
                        className="min-h-[100px] p-4 rounded-xl border-2"
                        style={{
                          backgroundColor: colors.neutral[50],
                          borderColor: colors.border,
                          color: colors.text,
                        }}
                      >
                        {user.bio ? (
                          <p className="leading-relaxed">{user.bio}</p>
                        ) : (
                          <div className="text-center py-6">
                            <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm font-medium" style={{ color: colors.textMuted }}>
                              No especificada
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botones de Edición */}
                  {isEditing && (
                    <div
                      className="flex justify-end gap-3 pt-4 border-t"
                      style={{ borderColor: colors.border }}
                    >
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="rounded-xl h-11"
                        style={{
                          borderColor: colors.border,
                          color: colors.textSecondary,
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-xl h-11"
                        style={{
                          backgroundColor: colors.primary[500],
                          color: colors.surface,
                        }}
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar Cambios
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card
                className="shadow-md border-0 rounded-2xl"
                style={{ backgroundColor: colors.surface }}
              >
                <CardContent className="p-8 text-center">
                  <motion.div
                    className="w-32 h-32 rounded-2xl mx-auto mb-6 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: roleColors.bg }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{ backgroundColor: roleColors.text }}
                    />
                    <User className="h-16 w-16 relative z-10" style={{ color: roleColors.text }} />
                  </motion.div>

                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2" style={{ color: colors.text }}>
                      {fullName}
                    </h2>
                    <Badge
                      className="px-4 py-2 text-sm font-semibold rounded-xl shadow-sm"
                      style={{
                        backgroundColor: roleColors.bg,
                        color: roleColors.text,
                        border: `2px solid ${roleColors.border}`,
                      }}
                    >
                      {roleTitle}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Firma Digital */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card
                className="shadow-md border-0 rounded-2xl"
                style={{ backgroundColor: colors.surface }}
              >
                <CardHeader className="pb-4 border-b" style={{ borderColor: colors.border }}>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ backgroundColor: colors.accent[50] }}>
                      <Award className="h-5 w-5" style={{ color: colors.accent[500] }} />
                    </div>
                    <span className="text-lg font-semibold" style={{ color: colors.text }}>
                      Firma Digital
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {(signatureUrl && !signatureError) || localSignature?.signature ? (
                    <div className="space-y-4">
                      <div
                        className="p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md"
                        style={{
                          backgroundColor: colors.success[50],
                          borderColor: colors.success[200],
                        }}
                      >
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative">
                            <CheckCircle
                              className="absolute -top-2 -right-2 h-6 w-6 z-10"
                              style={{ color: colors.success[600] }}
                            />
                            {signatureUrl && !signatureError ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={signatureUrl}
                                alt="Firma digital"
                                className="max-h-20 max-w-full object-contain border rounded-lg shadow-sm"
                                style={{ backgroundColor: colors.surface }}
                                onError={() => {
                                  console.error("Error cargando firma, usando fallback local");
                                  setSignatureError(true);
                                  loadLocalSignature();
                                }}
                              />
                            ) : localSignature?.signature ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={localSignature.signature}
                                alt="Firma digital"
                                className="max-h-20 max-w-full object-contain border rounded-lg shadow-sm"
                                style={{ backgroundColor: colors.surface }}
                              />
                            ) : null}
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold mb-1" style={{ color: colors.text }}>
                            {fullName}
                          </p>
                          <p
                            className="text-sm flex items-center justify-center gap-1"
                            style={{ color: colors.textMuted }}
                          >
                            <Calendar className="h-3 w-3" />
                            Registrada el{" "}
                            {user.updatedAt
                              ? new Date(user.updatedAt).toLocaleDateString("es-AR")
                              : "Fecha no disponible"}
                          </p>
                        </div>
                      </div>
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: colors.success[50] }}
                      >
                        <p
                          className="text-xs text-center flex items-center justify-center gap-1"
                          style={{ color: colors.success[700] }}
                        >
                          <Shield className="h-3 w-3" />
                          Firma registrada con validez legal
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="p-6 rounded-xl border-2 text-center"
                      style={{
                        backgroundColor: colors.warning[50],
                        borderColor: colors.warning[200],
                      }}
                    >
                      <AlertCircle
                        className="h-8 w-8 mx-auto mb-3"
                        style={{ color: colors.warning[600] }}
                      />
                      <p className="font-semibold mb-2" style={{ color: colors.warning[700] }}>
                        Firma Digital No Registrada
                      </p>
                      <p className="text-sm" style={{ color: colors.warning[600] }}>
                        Debe registrar su firma digital para validar documentos oficiales.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Diálogo de Confirmación para Logout */}
      <ConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
        title="¿Cerrar sesión?"
        description="Perderás el acceso a tus datos hasta que vuelvas a iniciar sesión."
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        type="info"
      />
    </div>
  );
}
