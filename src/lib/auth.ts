import { UserI, UserRole } from '@/types/auth'

/**
 * AuthService - Utilidades para manejo de información de usuario
 * 
 * NOTA: Este servicio solo contiene funciones de utilidad para formateo y presentación.
 * El estado de autenticación se maneja exclusivamente con Redux.
 */
export class AuthService {
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