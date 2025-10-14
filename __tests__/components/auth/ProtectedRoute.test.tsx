import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ProtectedRoute, authReducer } from "@/features/auth";
import { UserRole } from "@/types/auth";

describe("ProtectedRoute", () => {
  const mockUser = {
    id: "1",
    firstName: "Test",
    lastName: "User",
    email: "test@test.com",
    phone: "123456789",
    documentNumber: "12345678",
    role: UserRole.TERAPEUTA,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  };

  beforeEach(() => {
    // Reset mocks before each test
  });

  it("debe mostrar spinner mientras inicializa", () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          isAuthenticated: false,
          user: null,
          loading: true,
          error: null,
          initialized: false,
        },
      },
    });

    render(
      <Provider store={store}>
        <ProtectedRoute>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </Provider>
    );

    // Buscar el spinner por clase
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("debe mostrar el contenido si el usuario está autenticado", () => {
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

    render(
      <Provider store={store}>
        <ProtectedRoute>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </Provider>
    );

    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
  });

  it("no debe mostrar contenido si el usuario no está autenticado", () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
          initialized: true,
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <ProtectedRoute>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </Provider>
    );

    expect(container.textContent).toBe("");
  });

  it("debe mostrar contenido si el usuario tiene el rol permitido", () => {
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

    render(
      <Provider store={store}>
        <ProtectedRoute allowedRoles={[UserRole.TERAPEUTA]}>
          <div>Contenido protegido para terapeuta</div>
        </ProtectedRoute>
      </Provider>
    );

    expect(screen.getByText("Contenido protegido para terapeuta")).toBeInTheDocument();
  });

  it("no debe mostrar contenido si el usuario no tiene el rol permitido", () => {
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

    const { container } = render(
      <Provider store={store}>
        <ProtectedRoute allowedRoles={[UserRole.DIRECTOR]}>
          <div>Contenido protegido para director</div>
        </ProtectedRoute>
      </Provider>
    );

    expect(container.textContent).toBe("");
  });
});

