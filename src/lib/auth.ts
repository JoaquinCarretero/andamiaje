import { User, AuthResponse, UserRole } from '@/types/auth'
import { apiClient } from './api'

export class AuthService {
  private static readonly TOKEN_KEY = 'authToken'
  private static readonly USER_KEY = 'authUser'

  // Guardar tokens y usuario en localStorage
  static setAuth(authResponse: AuthResponse): void {
    if (authResponse.token) localStorage.setItem(this.TOKEN_KEY, authResponse.token)
    if (authResponse.user) localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user))
  }

  // Obtener token del localStorage
  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  // Obtener usuario del localStorage de forma segura
  static getUser(): User | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(this.USER_KEY)
    if (!userStr || userStr === 'undefined') return null
    try {
      return JSON.parse(userStr)
    } catch (error) {
      console.warn('Usuario en localStorage no es JSON válido:', userStr)
      return null
    }
  }

  // Verificar si hay sesión activa
  static isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser()
  }

  // Cerrar sesión
  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    localStorage.removeItem('userSignature')
  }

  // Obtener usuario actualizado del servidor
  static async getCurrentUser(): Promise<User | null> {
    try {
      if (!this.isAuthenticated()) return null
      const user = await apiClient.getProfile()
      if (user) localStorage.setItem(this.USER_KEY, JSON.stringify(user))
      return user
    } catch (error) {
      return this.getUser()
    }
  }

  // Nombre completo
  static getFullName(user?: User | null): string {
    if (!user) return 'Usuario'
    return `${user.firstName} ${user.lastName}`
  }

  // Título según rol
  static getRoleTitle(role?: UserRole): string {
    switch (role) {
      case UserRole.TERAPEUTA:
        return 'Terapeuta Ocupacional'
      case UserRole.ACOMPANANTE:
        return 'Acompañante Externo'
      case UserRole.COORDINADOR_UNO:
      case UserRole.COORDINADOR_DOS:
        return 'Coordinadora General'
      case UserRole.DIRECTOR:
        return 'Director General'
      default:
        return 'Usuario'
    }
  }

  // Rol para rutas
  static getRoleForRouting(role?: UserRole): string {
    switch (role) {
      case UserRole.TERAPEUTA:
        return 'terapeuta'
      case UserRole.ACOMPANANTE:
        return 'acompanante'
      case UserRole.COORDINADOR_UNO:
      case UserRole.COORDINADOR_DOS:
        return 'coordinador'
      case UserRole.DIRECTOR:
        return 'director'
      default:
        return 'terapeuta'
    }
  }

  // Saludo personalizado
  static getGreeting(user?: User | null): string {
    const hour = new Date().getHours()
    let timeGreeting = "Buenos días"
    if (hour >= 12 && hour < 18) timeGreeting = "Buenas tardes"
    else if (hour >= 18) timeGreeting = "Buenas noches"

    if (!user) return `${timeGreeting}, Usuario`

    switch (user.role) {
      case UserRole.TERAPEUTA:
      case UserRole.DIRECTOR:
        return `${timeGreeting}, Dr.`
      case UserRole.COORDINADOR_UNO:
      case UserRole.COORDINADOR_DOS:
        return `${timeGreeting}, ${user.firstName}`
      case UserRole.ACOMPANANTE:
      default:
        return `${timeGreeting}, Prof.`
    }
  }
}
