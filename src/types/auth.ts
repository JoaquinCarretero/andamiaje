export const UserRole = {
  TERAPEUTA: 'TERAPEUTA',
  ACOMPANANTE: 'ACOMPANANTE',
  COORDINADOR: 'COORDINADOR',
  DIRECTOR: 'DIRECTOR'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Mapeo para el backend
export const BACKEND_ROLES = {
  [UserRole.TERAPEUTA]: 'terapeuta',
  [UserRole.ACOMPANANTE]: 'acompaniante_externo',
  [UserRole.COORDINADOR]: 'coordinador_uno',
  [UserRole.DIRECTOR]: 'director'
} as const;

// Mapeo desde el backend
export const FRONTEND_ROLES = {
  'terapeuta': UserRole.TERAPEUTA,
  'acompaniante_externo': UserRole.ACOMPANANTE,
  'coordinador_uno': UserRole.COORDINADOR,
  'coordinador_dos': UserRole.COORDINADOR,
  'director': UserRole.DIRECTOR
} as const;

export interface LoginDto {
  documentNumber: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  password: string;
  role: UserRole;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  specialty?: string;
  license?: string;
  joinDate?: string;
  experience?: string;
  bio?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string; // El backend devuelve accessToken
  refreshToken?: string;
  expiresIn?: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
