import { User, AuthResponse } from '@/types/auth'
import { apiClient } from './api'

export class AuthService {
  private static readonly TOKEN_KEY = 'authToken'
  private static readonly USER_KEY = 'authUser'

  static setAuth(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token)
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user))
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(this.USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }

  static isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser()
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    localStorage.removeItem('userSignature')
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      if (!this.isAuthenticated()) return null
      
      // Intentar obtener el usuario actualizado del servidor
      const user = await apiClient.getProfile()
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
      return user
    } catch (error) {
      // Si falla, devolver el usuario del localStorage
      return this.getUser()
    }
  }

  static getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`
  }

  static getRoleTitle(role: string): string {
    switch (role) {
      case 'TERAPEUTA':
        return 'Terapeuta Ocupacional'
      case 'ACOMPANANTE':
        return 'Acompañante Externo'
      case 'COORDINADOR':
        return 'Coordinadora General'
      case 'DIRECTOR':
        return 'Director General'
      default:
        return 'Usuario'
    }
  }

  static getRoleForRouting(role: string): string {
    switch (role) {
      case 'TERAPEUTA':
        return 'terapeuta'
      case 'ACOMPANANTE':
        return 'acompanante'
      case 'COORDINADOR':
        return 'coordinador'
      case 'DIRECTOR':
        return 'director'
      default:
        return 'terapeuta'
    }
  }

  static getGreeting(user: User): string {
    const hour = new Date().getHours()
    let timeGreeting = "Buenos días"
    if (hour >= 12 && hour < 18) timeGreeting = "Buenas tardes"
    else if (hour >= 18) timeGreeting = "Buenas noches"
    
    if (user.role === 'TERAPEUTA') {
      return `${timeGreeting}, Dr.`
    }
    if (user.role === 'COORDINADOR') {
      return `${timeGreeting}, ${user.firstName}`
    }
    if (user.role === 'DIRECTOR') {
      return `${timeGreeting}, Dr.`
    }
    return `${timeGreeting}, Prof.`
  }
}