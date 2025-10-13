import { z } from "zod";

/**
 * Schema para actualizar perfil de usuario
 */
export const updateProfileSchema = z.object({
  phone: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .regex(/^[+]?[\d\s()-]+$/, "Formato de teléfono inválido")
    .optional()
    .or(z.literal("")),

  bio: z.string().max(500, "La biografía no puede exceder 500 caracteres").optional().or(z.literal("")),

  specialty: z
    .string()
    .min(3, "La especialidad debe tener al menos 3 caracteres")
    .max(100, "La especialidad no puede exceder 100 caracteres")
    .optional()
    .or(z.literal("")),

  license: z
    .string()
    .min(3, "La matrícula debe tener al menos 3 caracteres")
    .max(50, "La matrícula no puede exceder 50 caracteres")
    .optional()
    .or(z.literal("")),

  experience: z
    .string()
    .max(200, "La experiencia no puede exceder 200 caracteres")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

