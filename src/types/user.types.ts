import { Role } from "@prisma/client";

/**
 * Representación de un usuario del sistema CommodaFlow.
 * Coincide con el modelo `users` de Prisma, con `password` marcada como
 * opcional para que el tipo sea seguro en contextos donde nunca se expone
 * (por ejemplo, respuestas de API o contexto de sesión).
 */
export interface users {
  /** UUID único del usuario generado por la base de datos. */
  id: string;
  /** Nombre completo del usuario, usado en la interfaz y en las relaciones de alquiler. */
  name: string;
  /** Correo electrónico único; sirve como identificador de inicio de sesión. */
  email: string;
  /**
   * Rol del usuario en el sistema:
   * - `USER`  → acceso estándar (ver catálogo, gestionar sus alquileres, editar su perfil).
   * - `ADMIN` → acceso completo (crear equipos, ver todos los alquileres).
   */
  role: Role;
  /**
   * Hash bcrypt de la contraseña.
   * Marcado como opcional para que este tipo sea reutilizable en contextos
   * donde nunca debe exponerse la contraseña (respuestas JSON, estado de sesión).
   */
  password?: string;
}

/**
 * DTO para crear un nuevo usuario.
 * Excluye `id` (lo genera la BD) y `avatarUrl` (campo gestionado por separado),
 * y hace obligatoria la `password` (que en el resto del tipo es opcional).
 */
export type UserCreateInput = Omit<users, 'id' | 'avatarUrl'> & { password: string };

/**
 * DTO para actualizar el perfil de un usuario existente.
 * Solo permite modificar `name` y `password`; el `id`, `email` y `role`
 * no pueden cambiarse a través de la API pública de usuario.
 */
export type UpdateUserRequest = Partial<Omit<users, 'id' | 'email' | 'role'>>;
