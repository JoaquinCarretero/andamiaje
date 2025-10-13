import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  loginThunk,
  registerThunk,
  logoutThunk,
  checkAuthThunk,
  clearError,
  setUser,
} from '@/features/auth/store/authSlice';
import { apiClient } from '@/lib/api';
import type { UserI } from '@/types/auth';

// Mock del API client
vi.mock('@/lib/api', () => ({
  apiClient: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn(),
  },
}));

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore>;

  const mockUser: UserI = {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    phone: '+5491123456789',
    documentNumber: '12345678',
    role: 'TERAPEUTA',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    firstLogin: false,
    hasSignature: true,
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth;
      expect(state).toEqual({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
        initialized: false,
      });
    });
  });

  describe('loginThunk', () => {
    it('should set isAuthenticated to true on successful login', async () => {
      vi.mocked(apiClient.login).mockResolvedValueOnce(mockUser);

      await store.dispatch(
        loginThunk({
          documentNumber: '12345678',
          password: 'Test123',
        })
      );

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should set loading to true while login is pending', () => {
      vi.mocked(apiClient.login).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockUser), 100))
      );

      store.dispatch(
        loginThunk({
          documentNumber: '12345678',
          password: 'Test123',
        })
      );

      const state = store.getState().auth;
      expect(state.loading).toBe(true);
    });

    it('should set error on failed login', async () => {
      const errorMessage = 'Credenciales inválidas';
      vi.mocked(apiClient.login).mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(
        loginThunk({
          documentNumber: '12345678',
          password: 'wrongpassword',
        })
      );

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe(errorMessage);
      expect(state.loading).toBe(false);
    });
  });

  describe('registerThunk', () => {
    it('should set user and isAuthenticated on successful registration', async () => {
      vi.mocked(apiClient.register).mockResolvedValueOnce({ user: mockUser });

      await store.dispatch(
        registerThunk({
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
          phone: '+5491123456789',
          documentNumber: '12345678',
          password: 'Test123',
          role: 'TERAPEUTA',
        })
      );

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.initialized).toBe(true);
    });

    it('should set error on failed registration', async () => {
      const errorMessage = 'Email ya registrado';
      vi.mocked(apiClient.register).mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(
        registerThunk({
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
          phone: '+5491123456789',
          documentNumber: '12345678',
          password: 'Test123',
          role: 'TERAPEUTA',
        })
      );

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('logoutThunk', () => {
    it('should clear user and set isAuthenticated to false', async () => {
      // Primero hacer login
      vi.mocked(apiClient.login).mockResolvedValueOnce(mockUser);
      await store.dispatch(
        loginThunk({
          documentNumber: '12345678',
          password: 'Test123',
        })
      );

      // Luego logout
      vi.mocked(apiClient.logout).mockResolvedValueOnce(undefined);
      await store.dispatch(logoutThunk());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.loading).toBe(false);
    });
  });

  describe('checkAuthThunk', () => {
    it('should set user if authenticated', async () => {
      vi.mocked(apiClient.getProfile).mockResolvedValueOnce(mockUser);

      await store.dispatch(checkAuthThunk());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.initialized).toBe(true);
    });

    it('should set initialized to true even if not authenticated', async () => {
      vi.mocked(apiClient.getProfile).mockRejectedValueOnce(new Error('No autenticado'));

      await store.dispatch(checkAuthThunk());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.initialized).toBe(true);
      expect(state.error).toBeNull(); // No debe mostrar error en UI
    });

    it('should set loading to true while checking auth', () => {
      vi.mocked(apiClient.getProfile).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockUser), 100))
      );

      store.dispatch(checkAuthThunk());

      const state = store.getState().auth;
      expect(state.loading).toBe(true);
      expect(state.initialized).toBe(false);
    });
  });

  describe('Reducers', () => {
    it('should clear error when clearError is called', () => {
      // Establecer un error primero
      store.dispatch({ type: 'auth/login/rejected', payload: 'Error de prueba' });
      
      // Limpiar error
      store.dispatch(clearError());

      const state = store.getState().auth;
      expect(state.error).toBeNull();
    });

    it('should set user when setUser is called', () => {
      store.dispatch(setUser(mockUser));

      const state = store.getState().auth;
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should set isAuthenticated to false when setUser is called with null', () => {
      // Primero establecer un usuario
      store.dispatch(setUser(mockUser));
      
      // Luego limpiarlo
      store.dispatch(setUser(null));

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});

