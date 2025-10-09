import {
  LoginDto,
  RegisterDto,
  AuthResponse,
  ApiError,
  BACKEND_ROLES,
  FRONTEND_ROLES,
} from "@/types/auth";
import type { UserI } from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://andamiaje-api.onrender.com";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const text = await response.text();
        let errorData: ApiError = {
          message: text || "Error de conexión",
          statusCode: response.status,
        };
        try {
          errorData = JSON.parse(text);
        } catch {}
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const text = await response.text();
      try {
        return text ? JSON.parse(text) : ({} as T);
      } catch {
        throw new Error("Respuesta del servidor no válida");
      }
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Error de conexión con el servidor");
    }
  }

  // Auth endpoints
  async login(data: LoginDto): Promise<UserI> {
    await this.request<any>("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const user = await this.getProfile();
    return user;
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    // Convertir rol del frontend al backend
    const backendData = {
      ...data,
      role: BACKEND_ROLES[data.role] || data.role,
    };

    const response = await this.request<any>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(backendData),
    });

    // Verificar que la respuesta tenga los datos necesarios
    if (!response || !response.user) {
      throw new Error("Respuesta de registro inválida del servidor");
    }

    // Convertir rol del backend al frontend
    if (response.user && response.user.role) {
      response.user.role =
        FRONTEND_ROLES[response.user.role.toUpperCase() as keyof typeof FRONTEND_ROLES] ||
        response.user.role;
    }

    // Asegurar que los campos requeridos existan
    if (response.user) {
      // Procesar nombres de manera más robusta
      if (!response.user.firstName && !response.user.lastName && response.user.name) {
        const nameParts = response.user.name.trim().split(" ");
        response.user.firstName = nameParts[0] || "";
        response.user.lastName = nameParts.slice(1).join(" ") || "";
      } else {
        response.user.firstName = response.user.firstName?.trim() || "";
        response.user.lastName = response.user.lastName?.trim() || "";
      }

      response.user.firstLogin = response.user.firstLogin ?? true;
      response.user.hasSignature = response.user.hasSignature ?? false;
    }

    return response;
  }

  async getProfile(): Promise<UserI> {
    const response = await this.request<any>("/api/v1/auth/profile", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Convertir rol del backend al frontend
    if (response.role) {
      response.role =
        FRONTEND_ROLES[
          response?.role.toUpperCase() as keyof typeof FRONTEND_ROLES
        ] || response.role;
    }

    // Procesar nombres de manera más robusta
    if (!response.firstName && !response.lastName && response.name) {
      const nameParts = response.name.trim().split(" ");
      response.firstName = nameParts[0] || "";
      response.lastName = nameParts.slice(1).join(" ") || "";
    } else {
      response.firstName = response.firstName?.trim() || "";
      response.lastName = response.lastName?.trim() || "";
    }

    response.firstLogin = response.firstLogin ?? false;
    response.hasSignature = response.hasSignature ?? false;

    return response;
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/v1/auth/refresh", {
      method: "POST",
    });
  }

  async logout(): Promise<void> {
    await this.request<void>("/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  }

  // Storage endpoints
  async uploadSignature(file: File): Promise<{ key: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${this.baseURL}/api/v1/storage/upload?type=FIRMA_DIGITAL`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    if (!response.ok) {
      const text = await response.text();
      let errorData: ApiError = {
        message: text || "Error al subir archivo",
        statusCode: response.status,
      };
      try {
        errorData = JSON.parse(text);
      } catch {}
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    return response.json();
  }

  getDownloadUrl(key: string): string {
    return `${this.baseURL}/api/v1/storage/download?key=${encodeURIComponent(
      key
    )}`;
  }

  // User profile update
  async updateUserProfile(
    userId: string,
    data: {
      firstLogin?: boolean;
      hasSignature?: boolean;
      signatureKey?: string;
    }
  ): Promise<UserI> {
    const response = await this.request<any>(
      `/api/v1/users/profile/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

    // Convertir rol del backend al frontend si es necesario
    if (response.role) {
      response.role =
        FRONTEND_ROLES[
          response?.role.toUpperCase() as keyof typeof FRONTEND_ROLES
        ] || response.role;
    }

    // Procesar nombres
    if (!response.firstName && !response.lastName && response.name) {
      const nameParts = response.name.trim().split(" ");
      response.firstName = nameParts[0] || "";
      response.lastName = nameParts.slice(1).join(" ") || "";
    } else {
      response.firstName = response.firstName?.trim() || "";
      response.lastName = response.lastName?.trim() || "";
    }

    response.firstLogin = response.firstLogin ?? false;
    response.hasSignature = response.hasSignature ?? false;

    return response;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
