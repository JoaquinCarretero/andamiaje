export enum UserRole {
  TERAPEUTA = 'TERAPEUTA',
  ACOMPANANTE = 'ACOMPANANTE',
  COORDINADOR = 'COORDINADOR',
  DIRECTOR = 'DIRECTOR'
}

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
  token: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}