import { describe, it, expect } from "vitest";
import { AuthService } from "@/lib/auth";
import { UserRole, type UserI } from "@/types/auth";

describe("AuthService - Utility Functions", () => {
  const mockUser: UserI = {
    id: "1",
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan@test.com",
    phone: "123456789",
    documentNumber: "12345678",
    role: UserRole.TERAPEUTA,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  };

  describe("getFullName", () => {
    it("debe retornar nombre completo", () => {
      expect(AuthService.getFullName(mockUser)).toBe("Juan Pérez");
    });

    it("debe retornar 'Usuario' si no hay usuario", () => {
      expect(AuthService.getFullName(null)).toBe("Usuario");
    });

    it("debe manejar nombres sin apellido", () => {
      const user = { ...mockUser, lastName: "" };
      expect(AuthService.getFullName(user)).toBe("Juan");
    });
  });

  describe("getRoleTitle", () => {
    it("debe retornar título para TERAPEUTA", () => {
      expect(AuthService.getRoleTitle(UserRole.TERAPEUTA)).toBe("Terapeuta Ocupacional");
    });

    it("debe retornar título para ACOMPANANTE", () => {
      expect(AuthService.getRoleTitle(UserRole.ACOMPANANTE)).toBe("Acompañante Externo");
    });

    it("debe retornar título para COORDINADOR", () => {
      expect(AuthService.getRoleTitle(UserRole.COORDINADOR)).toBe("Coordinadora General");
    });

    it("debe retornar título para DIRECTOR", () => {
      expect(AuthService.getRoleTitle(UserRole.DIRECTOR)).toBe("Director General");
    });

    it("debe retornar 'Usuario' por defecto", () => {
      expect(AuthService.getRoleTitle(undefined)).toBe("Usuario");
    });
  });

  describe("getRoleForRouting", () => {
    it("debe retornar ruta correcta para cada rol", () => {
      expect(AuthService.getRoleForRouting(UserRole.TERAPEUTA)).toBe("terapeuta");
      expect(AuthService.getRoleForRouting(UserRole.ACOMPANANTE)).toBe("acompanante");
      expect(AuthService.getRoleForRouting(UserRole.COORDINADOR)).toBe("coordinador");
      expect(AuthService.getRoleForRouting(UserRole.DIRECTOR)).toBe("director");
    });
  });

  describe("getGreeting", () => {
    it("debe generar saludo apropiado según la hora", () => {
      const greeting = AuthService.getGreeting(mockUser);
      expect(greeting).toBeTruthy();
      // Acepta "Buenos días", "Buenas tardes", o "Buenas noches"
      expect(greeting).toMatch(/Buenos|Buenas/);
    });

    it("debe incluir Dr. para terapeuta", () => {
      const user = { ...mockUser, role: UserRole.TERAPEUTA };
      const greeting = AuthService.getGreeting(user);
      expect(greeting).toContain("Dr.");
    });

    it("debe manejar usuario null", () => {
      const greeting = AuthService.getGreeting(null);
      expect(greeting).toContain("Usuario");
    });
  });
});
