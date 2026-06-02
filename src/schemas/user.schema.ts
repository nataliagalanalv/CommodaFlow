import { z } from 'zod';

/**
 * Esquema de validación Zod para el registro de un nuevo usuario.
 *
 * Se aplica en `POST /api/auth/register` y como segunda capa de validación
 * en `POST /api/auth/login` (bloque de auto-registro cuando el email no existe).
 * Garantiza:
 * - Nombre real con entre 2 y 50 caracteres.
 * - Email con formato RFC válido.
 * - Contraseña con un mínimo de seguridad de 6 caracteres.
 * - Rol por defecto `USER` para que los nuevos registros sean siempre usuarios estándar.
 */
export const registerSchema = z.object({
  /** Nombre completo del usuario (entre 2 y 50 caracteres). */
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "Nombre demasiado largo"),

  /** Dirección de correo electrónico. Servirá como identificador único de login. */
  email: z.string()
    .email("Formato de email inválido"),

  /**
   * Contraseña en texto plano.
   * El servidor la hashea con bcrypt (salt=10) antes de almacenarla;
   * nunca se guarda en texto claro en la base de datos.
   */
  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),

  /**
   * Nivel de acceso del nuevo usuario.
   * Defecto `USER` para que el auto-registro público no cree administradores.
   * El rol `ADMIN` solo puede asignarse desde el panel de gestión.
   */
  role: z.enum(['USER', 'ADMIN'])
    .optional()
    .default('USER'),
});

/**
 * Esquema de validación Zod para el inicio de sesión.
 *
 * Se aplica en `POST /api/auth/login`. La validación es intencionadamente
 * permisiva en la contraseña (solo exige que no esté vacía) para no dar
 * pistas sobre las reglas de la cuenta a un atacante.
 */
export const loginSchema = z.object({
  /** Email del usuario registrado. */
  email: z.string()
    .email("Email inválido"),

  /** Contraseña a verificar contra el hash almacenado en la base de datos. */
  password: z.string()
    .min(1, "La contraseña es requerida"),
});

/**
 * Tipo TypeScript inferido de `registerSchema`.
 * Útil para tipar el body de la petición y el estado de formularios de registro.
 */
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Tipo TypeScript inferido de `loginSchema`.
 * Útil para tipar el body de la petición y el estado de formularios de login.
 */
export type LoginInput = z.infer<typeof loginSchema>;
