import { UserI, AuthResponse, UserRole } from '@/types/auth'
import { apiClient } from './api'

export class AuthService {
  private static readonly TOKEN_KEY = 'authToken'
  private static readonly USER_KEY = 'authUser'

  // Guardar tokens y usuario en localStorage
  static setAuth(authResponse: AuthResponse): void {
    console.log('Setting auth with response:', authResponse)
    if (authResponse.accessToken) localStorage.setItem(this.TOKEN_KEY, authResponse.accessToken)
    if (authResponse.user) localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user))
  }

  // Obtener token del localStorage
  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  // Obtener usuario del localStorage de forma segura
  static getUser(): UserI | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(this.USER_KEY)
    if (!userStr || userStr === 'undefined') return null
    try {
      const user = JSON.parse(userStr)
      console.log('Retrieved user from localStorage:', user)
      return user
    } catch (error) {
      console.warn('Usuario en localStorage no es JSON válido:', userStr)
      return null
    }
  }

  // Verificar si hay sesión activa
  static isAuthenticated(): boolean {
    const hasToken = !!this.getToken()
    const hasUser = !!this.getUser()
    console.log('Auth check - hasToken:', hasToken, 'hasUser:', hasUser)
    return hasToken && hasUser
  }

  // Cerrar sesión
  static logout(): void {
    console.log('Logging out...')
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    localStorage.removeItem('userSignature')
  }

  // Obtener usuario actualizado del servidor
  static async getCurrentUser(): Promise<UserI | null> {
    try {
      if (!this.isAuthenticated()) return null
      const user = await apiClient.getProfile()
      if (user) localStorage.setItem(this.USER_KEY, JSON.stringify(user))
      console.log('Current user from server:', user)
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return this.getUser()
    }
  }

  // Nombre completo
  static getFullName(user?: UserI | null): string {
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
      case UserRole.COORDINADOR:
        return 'Coordinadora General'
      case UserRole.DIRECTOR:
        return 'Director General'
      default:
        return 'Usuario'
    }
  }

  // Rol para rutas
  static getRoleForRouting(role: UserRole): string {
    console.log('Getting route for role:', role)
    switch (role) {
      case UserRole.TERAPEUTA:
        return 'terapeuta'
      case UserRole.ACOMPANANTE:
        return 'acompanante'
      case UserRole.COORDINADOR:
      case UserRole.COORDINADOR_UNO:
        return 'coordinador'
      case UserRole.DIRECTOR:
        return 'director'
      default:
        console.warn('Unknown role, defaulting to terapeuta:', role)
        return 'terapeuta'
    }
  }

  // Saludo personalizado
  static getGreeting(user?: UserI | null): string {
    const hour = new Date().getHours()
    let timeGreeting = "Buenos días"
    if (hour >= 12 && hour < 18) timeGreeting = "Buenas tardes"
    else if (hour >= 18) timeGreeting = "Buenas noches"

    if (!user) return `${timeGreeting}, Usuario`

    switch (user.role) {
      case UserRole.TERAPEUTA:
      case UserRole.DIRECTOR:
        return `${timeGreeting}, Dr.`
      case UserRole.COORDINADOR:
        return `${timeGreeting}, ${user.firstName}`
      case UserRole.ACOMPANANTE:
      default:
        return `${timeGreeting}, Prof.`
    }
  }
}
