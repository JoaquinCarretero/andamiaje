"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Mail, 
  Phone, 
  Shield, 
  Edit, 
  ArrowLeft,
  Key,
  LogOut,
  Briefcase,
  Award,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/shared/navbar"
import { ProfileEditModal } from "@/components/ui/profile-edit-modal"
import { ProfileCompletionBanner } from "@/components/ui/profile-completion-banner"
import { useSignature } from "@/lib/signature-storage"
import colors from "@/lib/colors"
import { Label } from "@/components/ui/label"
import { AuthService } from "@/lib/auth"
import type { User, UserRole } from "@/types/auth"

export default function ProfilePage() {
  const router = useRouter()
  const { getSignature } = useSignature()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
        if (!currentUser) {
          router.push('/login')
          return
        }
        setUser(currentUser)
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const signature = getSignature()

  const handleSaveProfile = (updatedData: any) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData }
      setUser(updatedUser)
      localStorage.setItem('authUser', JSON.stringify(updatedUser))
    }
  }

  const handleChangePassword = () => {
    router.push('/cambiar-contrasena')
  }

  const handleLogout = () => {
    // Limpiar todo el localStorage relacionado con la sesión
    AuthService.logout()
    // Forzar recarga para limpiar cualquier estado residual
    window.location.href = '/login'
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case UserRole.TERAPEUTA:
        return { bg: colors.primary[50], text: colors.primary[600], border: colors.primary[200] }
      case UserRole.COORDINADOR:
        return { bg: colors.secondary[50], text: colors.secondary[600], border: colors.secondary[200] }
      case UserRole.ACOMPANANTE:
        return { bg: colors.accent[50], text: colors.accent[600], border: colors.accent[200] }
      default:
        return { bg: colors.neutral[50], text: colors.neutral[600], border: colors.neutral[200] }
    }
  }

  // Calcular completitud del perfil
  const getProfileCompleteness = () => {
    if (!user) return 0
    const fields = [
      user.phone
    ]
    const completed = fields.filter(field => field && field.trim()).length
    return Math.round((completed / fields.length) * 100)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const fullName = AuthService.getFullName(user)
  const roleTitle = AuthService.getRoleTitle(user.role)
  const roleColors = getRoleColor(user.role)
  const profileCompleteness = getProfileCompleteness()
  const isProfileIncomplete = profileCompleteness < 100

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Navbar userData={user} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="w-fit rounded-lg transition-all duration-200 hover:shadow-sm"
            style={{ 
              color: colors.textSecondary,
              backgroundColor: colors.neutral[50]
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          <h1 className="font-display text-3xl lg:text-4xl font-bold" style={{ color: colors.text }}>
            Mi Perfil
          </h1>
        </div>

        {/* Banner de completar perfil */}
        {/* {isProfileIncomplete && (
          <div className="mb-8">
            <ProfileCompletionBanner 
              completeness={profileCompleteness}
              onComplete={() => setShowEditModal(true)}
            />
          </div>
        )} */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos Personales */}
            <Card className="shadow-soft border-0" style={{ backgroundColor: colors.surface }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" style={{ color: colors.primary[500] }} />
                    <span style={{ color: colors.text }}>Información Personal</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label style={{ color: colors.text }}>Nombre Completo</Label>
                    <div
                      className="h-11 px-3 py-2 rounded-md border flex items-center"
                      style={{
                        backgroundColor: colors.neutral[50],
                        borderColor: colors.border,
                        color: colors.textMuted
                      }}
                    >
                      {fullName}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: colors.text }}>Email</Label>
                    <div
                      className="h-11 px-3 py-2 rounded-md border flex items-center"
                      style={{
                        backgroundColor: colors.neutral[50],
                        borderColor: colors.border,
                        color: colors.textMuted
                      }}
                    >
                      {user.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: colors.text }}>Teléfono</Label>
                    {user.phone ? (
                      <div
                        className="h-11 px-3 py-2 rounded-md border flex items-center"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.text
                        }}
                      >
                        {user.phone}
                      </div>
                    ) : (
                      <div
                        className="h-11 px-3 py-2 rounded-md border flex items-center"
                        style={{
                          backgroundColor: colors.neutral[50],
                          borderColor: colors.border,
                          color: colors.textMuted
                        }}
                      >
                        <span className="text-sm">No especificado</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: colors.text }}>Rol</Label>
                    <div className="flex items-center gap-2 h-11">
                      <Badge
                        className="px-3 py-2 text-sm font-medium"
                        style={{
                          backgroundColor: roleColors.bg,
                          color: roleColors.text,
                          border: `1px solid ${roleColors.border}`
                        }}
                      >
                        {roleTitle}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label style={{ color: colors.text }}>Biografía Profesional</Label>
                  {false ? ( // Temporalmente deshabilitado hasta que el backend soporte bio
                    <div
                      className="min-h-[100px] p-3 rounded-md border"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text
                      }}
                    >
                      {/* {user.bio} */}
                    </div>
                  ) : (
                    <div
                      className="min-h-[100px] p-3 rounded-md border flex items-center justify-center"
                      style={{
                        backgroundColor: colors.neutral[50],
                        borderColor: colors.border,
                        color: colors.textMuted
                      }}
                    >
                      <span className="text-sm">No especificada - Puede agregar su biografía profesional</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información Profesional */}
            <Card className="shadow-soft border-0" style={{ backgroundColor: colors.surface }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" style={{ color: colors.secondary[500] }} />
                  <span style={{ color: colors.text }}>Información Profesional</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label style={{ color: colors.text }}>Especialidad</Label>
                    {user.specialty ? (
                      <div
                        className="h-11 px-3 py-2 rounded-md border flex items-center"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.text
                        }}
                      >
                        {user.specialty}
                      </div>
                    ) : (
                      <div
                        className="h-11 px-3 py-2 rounded-md border flex items-center"
                        style={{
                          backgroundColor: colors.neutral[50],
                          borderColor: colors.border,
                          color: colors.textMuted
                        }}
                      >
                        <span className="text-sm">No especificada</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: colors.text }}>Matrícula</Label>
                    {user.license ? (
                      <div
                        className="h-11 px-3 py-2 rounded-md border flex items-center"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.text
                        }}
                      >
                        {user.license}
                      </div>
                    ) : (
                      <div
                        className="h-11 px-3 py-2 rounded-md border flex items-center"
                        style={{
                          backgroundColor: colors.neutral[50],
                          borderColor: colors.border,
                          color: colors.textMuted
                        }}
                      >
                        <span className="text-sm">No especificada</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: colors.text }}>Fecha de Ingreso</Label>
                    <div
                      className="h-11 px-3 py-2 rounded-md border flex items-center"
                      style={{
                        backgroundColor: colors.neutral[50],
                        borderColor: colors.border,
                        color: colors.textMuted
                      }}
                    >
                      {user.joinDate || new Date(user.createdAt).toLocaleDateString('es-AR')}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: colors.text }}>Experiencia</Label>
                    {user.experience ? (
                      <div
                        className="h-11 px-3 py-2 rounded-md border flex items-center"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.text
                        }}
                      >
                        {user.experience}
                      </div>
                    ) : (
                      <div
                        className="h-11 px-3 py-2 rounded-md border flex items-center"
                        style={{
                          backgroundColor: colors.neutral[50],
                          borderColor: colors.border,
                          color: colors.textMuted
                        }}
                      >
                        <span className="text-sm">No especificada</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Avatar y Acciones Principales */}
            <Card className="shadow-soft border-0" style={{ backgroundColor: colors.surface }}>
              <CardContent className="p-6 text-center">
                <div 
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: roleColors.bg }}
                >
                  <User className="h-12 w-12" style={{ color: roleColors.text }} />
                </div>
                <h2 className="text-xl font-bold mb-1" style={{ color: colors.text }}>
                  {fullName}
                </h2>
                <p className="text-sm mb-4" style={{ color: colors.textMuted }}>
                  {roleTitle}
                </p>
                
                <div className="space-y-3">
                  <Button
                    onClick={handleChangePassword}
                    className="w-full"
                    variant="outline"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Cambiar Contraseña
                  </Button>
                  
                  <Button
                    onClick={handleLogout}
                    className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                    variant="outline"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Firma Digital */}
            <Card className="shadow-soft border-0" style={{ backgroundColor: colors.surface }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" style={{ color: colors.accent[500] }} />
                  <span style={{ color: colors.text }}>Firma Digital</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {signature ? (
                  <div className="space-y-4">
                    <div 
                      className="p-6 rounded-lg border-2"
                      style={{
                        backgroundColor: colors.success[50],
                        borderColor: colors.success[500]
                      }}
                    >
                      <div className="flex items-center justify-center mb-4">
                        <img
                          src={signature.signature}
                          alt="Firma digital"
                          className="max-h-20 max-w-full object-contain border rounded"
                          style={{ backgroundColor: colors.surface }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-medium" style={{ color: colors.text }}>
                          {signature.name}
                        </p>
                        <p className="text-sm" style={{ color: colors.textMuted }}>
                          Registrada el {new Date(signature.timestamp).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-center" style={{ color: colors.textMuted }}>
                      Su firma digital está registrada y tiene validez legal. No puede ser modificada por seguridad.
                    </p>
                  </div>
                ) : (
                  <div 
                    className="p-6 rounded-lg border-2 text-center"
                    style={{
                      backgroundColor: colors.warning[50],
                      borderColor: colors.warning[500]
                    }}
                  >
                    <p className="font-medium mb-2" style={{ color: colors.text }}>
                      Firma Digital No Registrada
                    </p>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      Debe registrar su firma digital para validar documentos oficiales.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estadísticas */}
            {/* <Card className="shadow-soft border-0" style={{ backgroundColor: colors.surface }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" style={{ color: colors.primary[500] }} />
                  <span style={{ color: colors.text }}>Estadísticas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" style={{ color: colors.textMuted }} />
                    <span className="text-sm" style={{ color: colors.text }}>Documentos</span>
                  </div>
                  <span className="font-bold" style={{ color: colors.primary[500] }}>
                    {user.documentsCount}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" style={{ color: colors.textMuted }} />
                    <span className="text-sm" style={{ color: colors.text }}>
                      {user.role === "terapeuta" ? "Pacientes" : "Estudiantes"}
                    </span>
                  </div>
                  <span className="font-bold" style={{ color: colors.secondary[500] }}>
                    {user.patientsCount}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" style={{ color: colors.textMuted }} />
                    <span className="text-sm" style={{ color: colors.text }}>Último Acceso</span>
                  </div>
                  <span className="font-bold" style={{ color: colors.accent[500] }}>
                    {user.lastLogin}
                  </span>
                </div>
              </CardContent>
            </Card> */}

            {/* Información de Contacto */}
            {/* <Card className="shadow-soft border-0" style={{ backgroundColor: colors.surface }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" style={{ color: colors.accent[500] }} />
                  <span style={{ color: colors.text }}>Contacto</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4" style={{ color: colors.textMuted }} />
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4" style={{ color: colors.textMuted }} />
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    {user.phone || "No especificado"}
                  </span>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>

        {/* Modal de Edición */}
        <ProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
          initialData={{
            phone: user.phone || "",
            bio: "",
            specialty: "",
            license: "",
            experience: ""
          }}
        />
      </main>
    </div>
  )
}