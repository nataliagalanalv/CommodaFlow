import { Role } from "@prisma/client";

/**
 * Representación de un usuario del sistema CommodaFlow.
 * Coincide con el modelo `users` de Prisma.
 *
 * Desde la integración con Firebase Auth, el `id` es el Firebase `uid` y
 * la contraseña ya NO se almacena aquí — Firebase gestiona toda la
 * autenticación. Neon DB solo guarda el perfil extendido del usuario.
 */
export interface users {
  /** Firebase uid del usuario; clave primaria en Neon DB. */
  id: string;
  /** Nombre completo del usuario, usado en la interfaz y en las relaciones de alquiler. */
  name: string;
  /** Correo electrónico único; sirve como identificador de inicio de sesión en Firebase. */
  email: string;
  /**
   * Rol del usuario en el sistema:
   * - `USER`  → acceso estándar (ver catálogo, gestionar sus alquileres, editar su perfil).
   * - `ADMIN` → acceso completo (crear equipos, ver todos los alquileres).
   */
  role: Role;
  /** URL opcional del avatar del usuario. */
  avatarUrl?: string | null;
}

/**
 * DTO para crear un nuevo perfil de usuario en Neon DB.
 * El `id` es obligatorio porque debe ser el Firebase `uid` (ya no lo genera la BD).
 * Excluye `avatarUrl`, que se gestiona por separado.
 */
export type UserCreateInput = Omit<users, 'avatarUrl'>;

/**
 * DTO para actualizar el perfil de un usuario existente.
 * Solo permite modificar `name`; el `id`, `email` y `role` no pueden cambiarse
 * a través de la API pública de usuario. La contraseña se gestiona en Firebase.
 */
export type UpdateUserRequest = Partial<Pick<users, 'name'>>;
