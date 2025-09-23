export const UserRole = {
  TERAPEUTA: 'TERAPEUTA',
  ACOMPANANTE: 'ACOMPANANTE',
  COORDINADOR: 'COORDINADOR',
  COORDINADOR_UNO: 'COORDINADOR_UNO',
  DIRECTOR: 'DIRECTOR'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Mapeo para el backend
export const BACKEND_ROLES = {
  [UserRole.TERAPEUTA]: 'TERAPEUTA',
  [UserRole.ACOMPANANTE]: 'ACOMPANIANTE_EXTERNO',
  [UserRole.COORDINADOR]: 'COORDINADOR_UNO',
  [UserRole.COORDINADOR_UNO]: 'COORDINADOR_UNO',
  [UserRole.DIRECTOR]: 'DIRECTOR'
} as const;

// Mapeo desde el backend
export const FRONTEND_ROLES = {
  'TERAPEUTA': UserRole.TERAPEUTA,
  'ACOMPANIANTE_EXTERNO': UserRole.ACOMPANANTE,
  'COORDINADOR_UNO': UserRole.COORDINADOR,
  // 'coordinador_dos': UserRole.COORDINADOR,
  'DIRECTOR': UserRole.DIRECTOR
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

export interface UserI {
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
  firstLogin?: boolean;
  hasSignature?: boolean;
}

export interface AuthResponse {
  user: UserI;
  accessToken: string; // El backend devuelve accessToken
  refreshToken?: string;
  expiresIn?: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
