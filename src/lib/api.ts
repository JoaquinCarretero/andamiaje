import { LoginDto, RegisterDto, AuthResponse, ApiError, BACKEND_ROLES, FRONTEND_ROLES } from '@/types/auth'
import type { User } from '@/types/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://andamiaje-api.onrender.com'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    }

    // Agregar token si existe
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const text = await response.text()
        // Intentar parsear JSON de error
        let errorData: ApiError = { message: text || 'Error de conexión', statusCode: response.status }
        try { errorData = JSON.parse(text) } catch {}
        throw new Error(errorData.message || `Error ${response.status}`)
      }

      // Manejar respuestas 204 No Content
      if (response.status === 204) {
        throw new Error('El servidor no devolvió datos de autenticación')
      }

      const text = await response.text()
      // Intentar parsear JSON de respuesta
      try {
        return text ? JSON.parse(text) : ({} as T)
      } catch (err) {
        console.warn('Respuesta no es JSON válido:', text)
        throw new Error('Respuesta del servidor no válida')
      }
    } catch (error) {
      if (error instanceof Error) throw error
      throw new Error('Error de conexión con el servidor')
    }
  }

  // Auth endpoints
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await this.request<any>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Verificar que la respuesta tenga los datos necesarios
    if (!response || !response.user || !response.accessToken) {
      throw new Error('Respuesta de login inválida del servidor')
    }

    // Convertir rol del backend al frontend
    if (response.user && response.user.role) {
      response.user.role = FRONTEND_ROLES[response.user.role as keyof typeof FRONTEND_ROLES] || response.user.role;
    }

    return response;
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    // Convertir rol del frontend al backend
    const backendData = {
      ...data,
      role: BACKEND_ROLES[data.role] || data.role
    };

    const response = await this.request<any>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });

    // Verificar que la respuesta tenga los datos necesarios
    if (!response || !response.user || !response.accessToken) {
      throw new Error('Respuesta de registro inválida del servidor')
    }

    // Convertir rol del backend al frontend
    if (response.user && response.user.role) {
      response.user.role = FRONTEND_ROLES[response.user.role as keyof typeof FRONTEND_ROLES] || response.user.role;
    }

    return response;
  }

  async getProfile(): Promise<User> {
    const response = await this.request<any>('/api/v1/auth/profile');
    
    // Convertir rol del backend al frontend
    if (response.role) {
      response.role = FRONTEND_ROLES[response.role as keyof typeof FRONTEND_ROLES] || response.role;
    }

    return response;
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/auth/refresh', {
      method: 'POST',
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
