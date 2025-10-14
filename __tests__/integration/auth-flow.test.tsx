import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import { apiClient } from '@/lib/api';
import type { UserI } from '@/types/auth';

// Mock del API client
vi.mock('@/lib/api', () => ({
  apiClient: {
    login: vi.fn(),
    getProfile: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock del router de Next.js
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/login',
}));

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

describe('Authentication Flow Integration', () => {
  it('should complete full login flow successfully', async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    vi.mocked(apiClient.login).mockResolvedValueOnce(mockUser);

    // Simular dispatch de loginThunk
    await store.dispatch({
      type: 'auth/login/fulfilled',
      payload: { user: mockUser },
    } as any);

    const authState = store.getState().auth;
    expect(authState.isAuthenticated).toBe(true);
    expect(authState.user).toEqual(mockUser);
    expect(authState.loading).toBe(false);
  });

  it('should handle logout correctly', async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: mockUser,
          loading: false,
          error: null,
          initialized: true,
        },
      },
    });

    vi.mocked(apiClient.logout).mockResolvedValueOnce(undefined);

    await store.dispatch({
      type: 'auth/logout/fulfilled',
    } as any);

    const authState = store.getState().auth;
    expect(authState.isAuthenticated).toBe(false);
    expect(authState.user).toBeNull();
  });

  it('should initialize auth state on app load', async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    vi.mocked(apiClient.getProfile).mockResolvedValueOnce(mockUser);

    await store.dispatch({
      type: 'auth/checkAuth/fulfilled',
      payload: { user: mockUser },
    } as any);

    const authState = store.getState().auth;
    expect(authState.isAuthenticated).toBe(true);
    expect(authState.initialized).toBe(true);
    expect(authState.user).toEqual(mockUser);
  });

  it('should handle auth check failure gracefully', async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    vi.mocked(apiClient.getProfile).mockRejectedValueOnce(new Error('No autenticado'));

    await store.dispatch({
      type: 'auth/checkAuth/rejected',
      payload: 'No autenticado',
    } as any);

    const authState = store.getState().auth;
    expect(authState.isAuthenticated).toBe(false);
    expect(authState.initialized).toBe(true);
    expect(authState.error).toBeNull(); // No debe mostrar error en UI
  });
});

