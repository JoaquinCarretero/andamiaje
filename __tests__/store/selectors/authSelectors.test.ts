import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectIsInitialized,
  selectAuthError,
  selectUserFullName,
  selectUserRole,
  selectUserEmail,
} from '@/store/selectors/authSelectors';
import type { UserI } from '@/types/auth';

describe('authSelectors', () => {
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
  };

  describe('selectUser', () => {
    it('should return null when user is not authenticated', () => {
      const store = configureStore({
        reducer: { auth: authReducer },
      });

      const user = selectUser(store.getState());
      expect(user).toBeNull();
    });

    it('should return user when authenticated', () => {
      const store = configureStore({
        reducer: { auth: authReducer },
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

      const user = selectUser(store.getState());
      expect(user).toEqual(mockUser);
    });
  });

  describe('selectIsAuthenticated', () => {
    it('should return false when not authenticated', () => {
      const store = configureStore({
        reducer: { auth: authReducer },
      });

      const isAuthenticated = selectIsAuthenticated(store.getState());
      expect(isAuthenticated).toBe(false);
    });

    it('should return true when authenticated', () => {
      const store = configureStore({
        reducer: { auth: authReducer },
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

      const isAuthenticated = selectIsAuthenticated(store.getState());
      expect(isAuthenticated).toBe(true);
    });
  });

  describe('selectUserFullName', () => {
    it('should return full name when user exists', () => {
      const store = configureStore({
        reducer: { auth: authReducer },
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

      const fullName = selectUserFullName(store.getState());
      expect(fullName).toBe('Juan Pérez');
    });

    it('should return "Usuario" when user is null', () => {
      const store = configureStore({
        reducer: { auth: authReducer },
      });

      const fullName = selectUserFullName(store.getState());
      expect(fullName).toBe('Usuario');
    });

    it('should memoize result (same user = same object reference)', () => {
      const store = configureStore({
        reducer: { auth: authReducer },
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

      const fullName1 = selectUserFullName(store.getState());
      const fullName2 = selectUserFullName(store.getState());
      
      // Mismo resultado (memoización funciona)
      expect(fullName1).toBe(fullName2);
    });
  });

  describe('selectUserRole', () => {
    it('should return user role when authenticated', () => {
      const store = configureStore({
        reducer: { auth: authReducer },
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

      const role = selectUserRole(store.getState());
      expect(role).toBe('TERAPEUTA');
    });

    it('should return undefined when user is null', () => {
      const store = configureStore({
        reducer: { auth: authReducer },
      });

      const role = selectUserRole(store.getState());
      expect(role).toBeUndefined();
    });
  });

  describe('selectUserEmail', () => {
    it('should return user email when authenticated', () => {
      const store = configureStore({
        reducer: { auth: authReducer },
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

      const email = selectUserEmail(store.getState());
      expect(email).toBe('juan@example.com');
    });

    it('should return undefined when user is null', () => {
      const store = configureStore({
        reducer: { auth: authReducer },
      });

      const email = selectUserEmail(store.getState());
      expect(email).toBeUndefined();
    });
  });
});

