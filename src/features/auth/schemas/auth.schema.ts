import { z } from "zod";
import { UserRole } from "@/types/auth";

/**
 * Schema de validación para Login
 */
export const loginSchema = z.object({
  documentNumber: z
    .string()
    .min(1, "El DNI es obligatorio")
    .min(7, "El DNI debe tener entre 7 y 8 dígitos")
    .max(8, "El DNI debe tener entre 7 y 8 dígitos")
    .regex(/^\d+$/, "El DNI solo puede contener números"),

  password: z.string().min(1, "La contraseña es obligatoria").min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schema de validación para Registro
 */
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, "El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),

  lastName: z
    .string()
    .min(1, "El apellido es obligatorio")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El apellido solo puede contener letras"),

  email: z.string().min(1, "El email es obligatorio").email("Formato de email inválido"),

  phone: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .regex(/^[+]?[\d\s()-]+$/, "Formato de teléfono inválido"),

  documentNumber: z
    .string()
    .min(1, "El DNI es obligatorio")
    .min(7, "El DNI debe tener entre 7 y 8 dígitos")
    .max(8, "El DNI debe tener entre 7 y 8 dígitos")
    .regex(/^\d+$/, "El DNI solo puede contener números"),

  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número"),

  confirmPassword: z.string().min(1, "Confirma tu contraseña"),

  role: z.nativeEnum(UserRole, {
    message: "Selecciona un rol válido",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Schema para cambiar contraseña
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es obligatoria"),

    newPassword: z
      .string()
      .min(1, "La nueva contraseña es obligatoria")
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),

    confirmPassword: z.string().min(1, "Confirma tu nueva contraseña"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "La nueva contraseña debe ser diferente a la actual",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

