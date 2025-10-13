import { createSelector } from "reselect";
import { RootState } from "../index";
import { UserI } from "@/types/auth";

/**
 * Selectors básicos (input selectors)
 */
const selectAuthState = (state: RootState) => state.auth;

/**
 * Selectors memoizados con reselect
 */

// Usuario actual
export const selectUser = createSelector([selectAuthState], (auth) => auth.user);

// Estado de autenticación
export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

// Estado de carga
export const selectIsLoading = createSelector([selectAuthState], (auth) => auth.loading);

// Estado de inicialización
export const selectIsInitialized = createSelector([selectAuthState], (auth) => auth.initialized);

// Error actual
export const selectAuthError = createSelector([selectAuthState], (auth) => auth.error);

// Nombre completo del usuario (computado)
export const selectUserFullName = createSelector([selectUser], (user): string => {
  if (!user) return "Usuario";
  const firstName = user.firstName?.trim() || "";
  const lastName = user.lastName?.trim() || "";
  if (!firstName && !lastName && user.name) {
    return user.name;
  }
  return `${firstName} ${lastName}`.trim() || "Usuario";
});

// Rol del usuario
export const selectUserRole = createSelector([selectUser], (user) => user?.role);

// Email del usuario
export const selectUserEmail = createSelector([selectUser], (user) => user?.email);

// Usuario con estado de loading (computado complejo)
export const selectUserWithLoadingState = createSelector(
  [selectUser, selectIsLoading, selectIsInitialized],
  (user, loading, initialized) => ({
    user,
    loading,
    initialized,
    isReady: initialized && !loading,
  })
);

// Verificar si necesita completar perfil
export const selectNeedsProfileCompletion = createSelector([selectUser], (user): boolean => {
  if (!user) return false;
  return user.firstLogin === true && user.hasSignature === false;
});

// Estado completo de auth (para debugging)
export const selectAuthDebugInfo = createSelector([selectAuthState], (auth) => ({
  isAuthenticated: auth.isAuthenticated,
  initialized: auth.initialized,
  loading: auth.loading,
  hasUser: !!auth.user,
  userRole: auth.user?.role,
  error: auth.error,
}));
