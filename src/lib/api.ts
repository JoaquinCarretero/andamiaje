import { LoginDto, RegisterDto, AuthResponse, ApiError, BACKEND_ROLES, FRONTEND_ROLES } from '@/types/auth'
import type { UserI } from '@/types/auth'

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
    console.log('Login request:', data)
    const response = await this.request<any>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    console.log('Login response:', response)

    // Verificar que la respuesta tenga los datos necesarios
    if (!response || !response.user || !response.accessToken) {
      console.error('Invalid login response:', response)
      throw new Error('Respuesta de login inválida del servidor')
    }

    // Convertir rol del backend al frontend
    if (response.user && response.user.role) {
      console.log('Converting role from backend:', response.user.role)
      response.user.role = FRONTEND_ROLES[response.user.role as keyof typeof FRONTEND_ROLES] || response.user.role;
      console.log('Converted role to frontend:', response.user.role)
    }

    // Asegurar que los campos requeridos existan
    if (response.user) {
      response.user.firstName = response.user.firstName || ''
      response.user.lastName = response.user.lastName || ''
      response.user.firstLogin = response.user.firstLogin ?? true
      response.user.hasSignature = response.user.hasSignature ?? false
    }

    return response;
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    console.log('Register request with role:', data.role)
    // Convertir rol del frontend al backend
    const backendData = {
      ...data,
      role: BACKEND_ROLES[data.role] || data.role
    };

    console.log('Register request to backend:', backendData)
    const response = await this.request<any>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });

    console.log('Register response:', response)
    // Verificar que la respuesta tenga los datos necesarios
    if (!response || !response.user || !response.accessToken) {
      console.error('Invalid register response:', response)
      throw new Error('Respuesta de registro inválida del servidor')
    }

    // Convertir rol del backend al frontend
    if (response.user && response.user.role) {
      console.log('Converting role from backend:', response.user.role)
      response.user.role = FRONTEND_ROLES[response.user.role as keyof typeof FRONTEND_ROLES] || response.user.role;
      console.log('Converted role to frontend:', response.user.role)
    }

    // Asegurar que los campos requeridos existan
    if (response.user) {
      response.user.firstName = response.user.firstName || ''
      response.user.lastName = response.user.lastName || ''
      response.user.firstLogin = response.user.firstLogin ?? true
      response.user.hasSignature = response.user.hasSignature ?? false
    }

    return response;
  }

  async getProfile(): Promise<UserI> {
    const response = await this.request<any>('/api/v1/auth/profile');
    
    // Convertir rol del backend al frontend
    if (response.role) {
      response.role = FRONTEND_ROLES[response?.role.toUpperCase() as keyof typeof FRONTEND_ROLES] || response.role;
    }

    // Asegurar que los campos requeridos existan
    response.firstName = response.firstName || ''
    response.lastName = response.lastName || ''
    response.firstLogin = response.firstLogin ?? false
    response.hasSignature = response.hasSignature ?? false

    return response;
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/auth/refresh', {
      method: 'POST',
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)