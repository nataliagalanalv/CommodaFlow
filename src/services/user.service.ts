import { neon } from '@neondatabase/serverless';
import { users as CustomUser, UserCreateInput, UpdateUserRequest } from '../types/user.types';

/**
 * Conexión directa a Neon (PostgreSQL serverless) mediante el driver HTTP.
 * Se usa en operaciones de usuario porque el modelo `users` se gestiona con
 * consultas SQL puras para mayor control sobre la normalización del rol.
 */
const sql = neon(process.env.DATABASE_URL!);

/**
 * Servicio de acceso a datos para el modelo `users`.
 *
 * Desde la integración con Firebase Auth, este servicio ya NO gestiona
 * contraseñas — Firebase se encarga de toda la autenticación. Neon DB
 * almacena únicamente el perfil extendido del usuario (nombre, rol, etc.)
 * indexado por el Firebase `uid`.
 */
export const UserService = {

  /**
   * Busca un usuario por su dirección de email.
   *
   * @param email - Email a buscar.
   * @returns El usuario si existe, o `null`.
   */
  findByEmail: async (email: string): Promise<CustomUser | null> => {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (result.length === 0) return null;
    return { ...result[0], role: result[0].role.toLowerCase() } as CustomUser;
  },

  /**
   * Crea un nuevo perfil de usuario en Neon DB.
   * El `id` debe ser el Firebase uid proporcionado por Firebase Auth;
   * ya no se genera un UUID local.
   *
   * @param data - Datos del usuario (id = Firebase uid, sin contraseña).
   * @returns El usuario creado con el `role` normalizado a minúsculas.
   */
  create: async (data: UserCreateInput): Promise<CustomUser> => {
    const result = await sql`
      INSERT INTO users (id, name, email, role)
      VALUES (${data.id}, ${data.name}, ${data.email}, ${data.role})
      RETURNING *
    `;
    return { ...result[0], role: result[0].role.toLowerCase() } as CustomUser;
  },

  /**
   * Obtiene los datos de un usuario por su Firebase uid.
   *
   * @param id - Firebase uid del usuario.
   * @returns El usuario o `null` si no existe.
   */
  async getById(id: string): Promise<CustomUser | null> {
    const result = await sql`SELECT * FROM users WHERE id = ${id}`;
    if (result.length === 0) return null;
    return { ...result[0], role: result[0].role.toLowerCase() } as CustomUser;
  },

  /**
   * Actualiza el nombre del usuario.
   * La contraseña ya no se gestiona aquí — Firebase Auth la maneja.
   *
   * @param id   - Firebase uid del usuario.
   * @param data - Campos a modificar (solo `name`).
   * @returns El usuario actualizado.
   */
  async update(id: string, data: UpdateUserRequest): Promise<CustomUser> {
    const exists = await sql`SELECT id FROM users WHERE id = ${id}`;
    if (exists.length === 0) throw new Error('Usuario no encontrado');

    const result = await sql`
      UPDATE users
      SET name = COALESCE(${data.name ?? null}, name)
      WHERE id = ${id}
      RETURNING *
    `;

    return { ...result[0], role: result[0].role.toLowerCase() } as CustomUser;
  },
};
