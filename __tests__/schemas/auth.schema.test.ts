import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema, changePasswordSchema } from "@/features/auth";
import { UserRole } from "@/types/auth";

describe("Auth Schemas", () => {
  describe("loginSchema", () => {
    it("debe validar datos correctos", () => {
      const validData = {
        documentNumber: "12345678",
        password: "password123",
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("debe rechazar DNI vacío", () => {
      const invalidData = {
        documentNumber: "",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("DNI es obligatorio");
      }
    });

    it("debe rechazar DNI con menos de 7 dígitos", () => {
      const invalidData = {
        documentNumber: "123456",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("debe rechazar DNI no numérico", () => {
      const invalidData = {
        documentNumber: "1234567a",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("debe rechazar contraseña corta", () => {
      const invalidData = {
        documentNumber: "12345678",
        password: "pass",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    it("debe validar datos completos de registro", () => {
      const validData = {
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan@test.com",
        phone: "1234567890",
        documentNumber: "12345678",
        password: "Password123",
        confirmPassword: "Password123",
        role: UserRole.TERAPEUTA,
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("debe rechazar contraseñas que no coinciden", () => {
      const invalidData = {
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan@test.com",
        phone: "1234567890",
        documentNumber: "12345678",
        password: "Password123",
        confirmPassword: "Password456",
        role: UserRole.TERAPEUTA,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("no coinciden");
      }
    });

    it("debe rechazar contraseña sin mayúscula", () => {
      const invalidData = {
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan@test.com",
        phone: "1234567890",
        documentNumber: "12345678",
        password: "password123",
        confirmPassword: "password123",
        role: UserRole.TERAPEUTA,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("debe rechazar email inválido", () => {
      const invalidData = {
        firstName: "Juan",
        lastName: "Pérez",
        email: "invalid-email",
        phone: "1234567890",
        documentNumber: "12345678",
        password: "Password123",
        confirmPassword: "Password123",
        role: UserRole.TERAPEUTA,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("changePasswordSchema", () => {
    it("debe validar cambio de contraseña correcto", () => {
      const validData = {
        currentPassword: "OldPass123",
        newPassword: "NewPass123",
        confirmPassword: "NewPass123",
      };

      const result = changePasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("debe rechazar si la nueva contraseña es igual a la actual", () => {
      const invalidData = {
        currentPassword: "SamePass123",
        newPassword: "SamePass123",
        confirmPassword: "SamePass123",
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("diferente");
      }
    });

    it("debe rechazar si las contraseñas nuevas no coinciden", () => {
      const invalidData = {
        currentPassword: "OldPass123",
        newPassword: "NewPass123",
        confirmPassword: "DifferentPass123",
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

