import { UserI, UserRole } from '@/types/auth'
import { apiClient } from './api'

export class AuthService {
  private static readonly USER_KEY = 'authUser'

  // Guardar usuario en localStorage (opcional)
  static setUser(user: UserI): void {
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    }
  }

  // Obtener usuario del localStorage
  static getUser(): UserI | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(this.USER_KEY)
    if (!userStr || userStr === 'undefined') return null
    try {
      console.log("🚀 ~ AuthService ~ getUser ~ JSON.parse(userStr):", JSON.parse(userStr))
      return JSON.parse(userStr)
    } catch (error) {
      console.error('Error parsing user from localStorage:', error)
      return null
    }
  }

  // Verificar si hay sesión activa consultando el usuario
  static async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      console.log("🚀 ~ AuthService ~ isAuthenticated ~ user:", user)
      return !!user
    } catch {
      return false
    }
  }
  
  // Obtener usuario actualizado del servidor
  static async getCurrentUser(): Promise<UserI | null> {
    try {
      // El apiClient ya enviará cookies con credentials: 'include'
      const user = await apiClient.getProfile()
      if (user) this.setUser(user)
      return user
    } catch (error: any) {
      // Modificación: Solo registrar en consola si el error NO es el esperado "sin acceso autorizado".
      // Esto evita llenar la consola con errores esperados durante la carga inicial.
      if (error?.message?.toLowerCase() !== 'sin acceso autorizado') {
        console.error('Error getting current user:', error)
      }
      return this.getUser()
    }
  }

  // Nombre completo
  static getFullName(user?: UserI | null): string {
    if (!user) return 'Usuario'
    let firstName = user.firstName?.trim() || ''
    let lastName = user.lastName?.trim() || ''
    if (!firstName && !lastName && user.name) {
      const parts = user.name.trim().split(' ')
      firstName = parts[0] || ''
      lastName = parts.slice(1).join(' ') || ''
    }
    if (!firstName && !lastName && user.email) {
      firstName = user.email.split('@')[0] || 'Usuario'
    }
    return `${firstName} ${lastName}`.trim() || 'Usuario'
  }

  // Título según rol
  static getRoleTitle(role?: UserRole): string {
    switch (role) {
      case UserRole.TERAPEUTA: return 'Terapeuta Ocupacional'
      case UserRole.ACOMPANANTE: return 'Acompañante Externo'
      case UserRole.COORDINADOR: return 'Coordinadora General'
      case UserRole.DIRECTOR: return 'Director General'
      default: return 'Usuario'
    }
  }

  // Rol para rutas
  static getRoleForRouting(role: UserRole): string {
    switch (role) {
      case UserRole.TERAPEUTA: return 'terapeuta'
      case UserRole.ACOMPANANTE: return 'acompanante'
      case UserRole.COORDINADOR:
      case UserRole.COORDINADOR_UNO: return 'coordinador'
      case UserRole.DIRECTOR: return 'director'
      default: return 'terapeuta'
    }
  }

  // Saludo personalizado
  static getGreeting(user?: UserI | null): string {
    const hour = new Date().getHours()
    let timeGreeting = 'Buenos días'
    if (hour >= 12 && hour < 18) timeGreeting = 'Buenas tardes'
    else if (hour >= 18) timeGreeting = 'Buenas noches'

    if (!user) return `${timeGreeting}, Usuario`
    const firstName = user.firstName || 'Usuario'

    switch (user.role) {
      case UserRole.TERAPEUTA:
      case UserRole.DIRECTOR: return `${timeGreeting}, Dr.`
      case UserRole.COORDINADOR: return `${timeGreeting}, ${firstName}`
      case UserRole.ACOMPANANTE:
      default: return `${timeGreeting}, Prof.`
    }
  }
}