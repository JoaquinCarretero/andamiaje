/**
 * Tipos para las respuestas de la API
 */

export interface ApiResponse<T = void> {
  data?: T;
  message?: string;
  statusCode: number;
}

export interface LoginResponse {
  message: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    name?: string;
    email: string;
    phone: string;
    documentNumber: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    firstLogin?: boolean;
    hasSignature?: boolean;
    signatureKey?: string;
  };
}

export interface ProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phone: string;
  documentNumber: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  specialty?: string;
  license?: string;
  joinDate?: string;
  experience?: string;
  bio?: string;
  firstLogin?: boolean;
  hasSignature?: boolean;
  signatureKey?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface UploadResponse {
  key: string;
  url?: string;
}

export interface UploadSignatureResponse extends UploadResponse {
  user: ProfileResponse;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  details?: Record<string, unknown>;
}

export interface UpdateProfileRequest {
  firstLogin?: boolean;
  hasSignature?: boolean;
  signatureKey?: string;
  phone?: string;
  bio?: string;
  specialty?: string;
  license?: string;
  experience?: string;
}
