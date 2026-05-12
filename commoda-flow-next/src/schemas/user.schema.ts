import { z } from 'zod';

// Esquema para el Registro (POST /api/auth/register)
export const registerSchema = z.object({
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "Nombre demasiado largo"),
    
  email: z.string()
    .email("Formato de email inválido"),
    
  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
    
  role: z.enum(['USER', 'ADMIN'])
    .optional()
    .default('USER'),
});

// Esquema para el Login (POST /api/auth/login)
export const loginSchema = z.object({
  email: z.string()
    .email("Email inválido"),
    
  password: z.string()
    .min(1, "La contraseña es requerida"),
});

// Tipos de TypeScript derivados de los esquemas (opcional, por si los necesitas en el front)
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;