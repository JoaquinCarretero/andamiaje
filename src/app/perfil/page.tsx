"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Edit, 
  Save, 
  ArrowLeft,
  Key,
  LogOut,
  Camera,
  MapPin,
  Briefcase,
  Award,
  Clock,
  FileText,
  Users,
  Settings
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/shared/navbar"
import { useSignature } from "@/lib/signature-storage"
import colors from "@/lib/colors"

// Simulamos obtener el usuario actual desde el localStorage o contexto
const getCurrentUser = () => {
  // En una aplicación real, esto vendría del contexto de autenticación
  return {
    id: "1",
    name: "Dr. María González",
    email: "maria.gonzalez@andamiaje.com",
    phone: "+54 11 1234-5678",
    role: "terapeuta",
    title: "Terapeuta Ocupacional",
    specialty: "Terapia Ocupacional",
    license: "MP 12345",
    joinDate: "2023-03-15",
    lastLogin: "2024-01-30",
    address: "Av. Corrientes 1234, CABA",
    bio: "Especialista en terapia ocupacional con más de 8 años de experiencia en rehabilitación neurológica y desarrollo infantil.",
    documentsCount: 24,
    patientsCount: 12,
    gender: "female"
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const { getSignature } = useSignature()
  const [user] = useState(getCurrentUser())
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [editableData, setEditableData] = useState({
    phone: user.phone,
    address: user.address,
    bio: user.bio
  })

  const signature = getSignature()

  const handleSave = async () => {
    setIsSaving(true)
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleChangePassword = () => {
    router.push('/cambiar-contrasena')
  }

  const handleLogout = () => {
    router.push('/login')
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "terapeuta":
        return { bg: colors.primary[50], text: colors.primary[600], border: colors.primary[200] }
      case "coordinador":
        return { bg: colors.secondary[50], text: colors.secondary[600], border: colors.secondary[200] }
      case "acompanante":
        return { bg: colors.accent[50], text: colors.accent[600], border: colors.accent[200] }
      default:
        return { bg: colors.neutral[50], text: colors.neutral[600], border: colors.neutral[200] }
    }
  }

  const roleColors = getRoleColor(user.role)

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
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    {isEditing ? "Cancelar" : "Editar"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label style={{ color: colors.text }}>Nombre Completo</Label>
                    <Input
                      value={user.name}
                      readOnly
                      className="h-11"
                      style={{
                        backgroundColor: colors.neutral[50],
                        borderColor: colors.border,
                        color: colors.textMuted
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: colors.text }}>Email</Label>
                    <Input
                      value={user.email}
                      readOnly
                      className="h-11"
                      style={{
                        backgroundColor: colors.neutral[50],
                        borderColor: colors.border,
                        color: colors.textMuted
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: colors.text }}>Teléfono</Label>
                    <Input
                      value={isEditing ? editableData.phone : user.phone}
                      onChange={(e) => setEditableData(prev => ({ ...prev, phone: e.target.value }))}
                      readOnly={!isEditing}
                      className="h-11"
                      style={{
                        backgroundColor: isEditing ? colors.surface : colors.neutral[50],
                        borderColor: colors.border,
                        color: isEditing ? colors.text : colors.textMuted
                      }}
                    />
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
                        {user.title}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label style={{ color: colors.text }}>Dirección</Label>
                  <Input
                    value={isEditing ? editableData.address : user.address}
                    onChange={(e) => setEditableData(prev => ({ ...prev, address: e.target.value }))}
                    readOnly={!isEditing}
                    className="h-11"
                    style={{
                      backgroundColor: isEditing ? colors.surface : colors.neutral[50],
                      borderColor: colors.border,
                      color: isEditing ? colors.text : colors.textMuted
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: colors.text }}>Biografía Profesional</Label>
                  <Textarea
                    value={isEditing ? editableData.bio : user.bio}
                    onChange={(e) => setEditableData(prev => ({ ...prev, bio: e.target.value }))}
                    readOnly={!isEditing}
                    className="min-h-[100px] resize-none"
                    style={{
                      backgroundColor: isEditing ? colors.surface : colors.neutral[50],
                      borderColor: colors.border,
                      color: isEditing ? colors.text : colors.textMuted
                    }}
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      style={{
                        backgroundColor: colors.primary[500],
                        color: colors.surface
                      }}
                    >
                      {isSaving ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Guardando...
                        </div>
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
                    <Input
                      value={user.specialty}
                      readOnly
                      className="h-11"
                      style={{
                        backgroundColor: colors.neutral[50],
                        borderColor: colors.border,
                        color: colors.textMuted
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: colors.text }}>Matrícula</Label>
                    <Input
                      value={user.license}
                      readOnly
                      className="h-11"
                      style={{
                        backgroundColor: colors.neutral[50],
                        borderColor: colors.border,
                        color: colors.textMuted
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: colors.text }}>Fecha de Ingreso</Label>
                    <Input
                      value={user.joinDate}
                      readOnly
                      className="h-11"
                      style={{
                        backgroundColor: colors.neutral[50],
                        borderColor: colors.border,
                        color: colors.textMuted
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: colors.text }}>Último Acceso</Label>
                    <Input
                      value={user.lastLogin}
                      readOnly
                      className="h-11"
                      style={{
                        backgroundColor: colors.neutral[50],
                        borderColor: colors.border,
                        color: colors.textMuted
                      }}
                    />
                  </div>
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
                        borderColor: colors.success[200]
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
                      borderColor: colors.warning[200]
                    }}
                  >
                    <Award className="h-12 w-12 mx-auto mb-4" style={{ color: colors.warning[500] }} />
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
                  {user.name}
                </h2>
                <p className="text-sm mb-4" style={{ color: colors.textMuted }}>
                  {user.title}
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

            {/* Estadísticas */}
            <Card className="shadow-soft border-0" style={{ backgroundColor: colors.surface }}>
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
                    <span className="text-sm" style={{ color: colors.text }}>Experiencia</span>
                  </div>
                  <span className="font-bold" style={{ color: colors.accent[500] }}>
                    8+ años
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            <Card className="shadow-soft border-0" style={{ backgroundColor: colors.surface }}>
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
                    {isEditing ? editableData.phone : user.phone}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4" style={{ color: colors.textMuted }} />
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    {isEditing ? editableData.address : user.address}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botón de guardar flotante cuando está editando */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 right-8 z-40"
          >
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="lg"
              className="shadow-xl rounded-full"
              style={{
                backgroundColor: colors.primary[500],
                color: colors.surface
              }}
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando...
                </div>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  )
}