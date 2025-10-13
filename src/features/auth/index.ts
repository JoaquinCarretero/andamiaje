/**
 * Feature: Authentication
 * 
 * Exportación centralizada de todo lo relacionado con autenticación
 */

// Components
export { AuthInitializer } from './components/AuthInitializer';
export { ProtectedRoute } from './components/ProtectedRoute';

// Hooks
export { useAuthRedux } from './hooks/useAuthRedux';

// Store
export { default as authReducer } from './store/authSlice';
export {
  loginThunk,
  registerThunk,
  logoutThunk,
  checkAuthThunk,
  setUser,
  clearError,
} from './store/authSlice';

// Schemas
export {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  type LoginFormData,
  type RegisterFormData,
  type ChangePasswordFormData,
} from './schemas/auth.schema';

// Types (re-export desde @/types/auth)
export type { UserI, UserRole, LoginDto, RegisterDto } from '@/types/auth';

