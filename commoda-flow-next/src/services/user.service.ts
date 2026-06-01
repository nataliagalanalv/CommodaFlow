import { neon } from '@neondatabase/serverless';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { users as CustomUser, UserCreateInput, UpdateUserRequest } from '../types/user.types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Conexión directa a Neon (PostgreSQL serverless) mediante el driver HTTP.
 * Se usa en operaciones de usuario porque el modelo `users` se gestiona con
 * consultas SQL puras para mayor control sobre la normalización del rol,
 * mientras que `Hardware` y `rentals` usan el cliente Prisma ORM.
 */
const sql = neon(process.env.DATABASE_URL!);

/**
 * Servicio de acceso a datos para el modelo `users`.
 *
 * Usa SQL nativo vía Neon (en lugar del ORM Prisma) porque la tabla `users`
 * mezcla valores de enum en formato "ADMIN"/"USER" (BD) con el formato
 * normalizado en minúsculas que usa la capa de presentación.
 * Todas las funciones devuelven el rol en minúsculas para coherencia con
 * las comprobaciones de acceso del frontend (`user.role === 'admin'`).
 */
export const UserService = {

  /**
   * Busca un usuario por su dirección de email.
   * Se usa en el proceso de login para verificar si el usuario existe
   * antes de comparar la contraseña.
   *
   * @param email - Email a buscar (case-sensitive según la BD).
   * @returns El usuario si existe (incluyendo `password` hash), o `null`.
   */
  findByEmail: async (email: string): Promise<CustomUser | null> => {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (result.length === 0) return null;

    const user = result[0];
    return {...user, role: user.role.toLowerCase() } as CustomUser;
  },

  /**
   * Crea un nuevo usuario en la base de datos.
   * La contraseña debe haberse hasheado con bcrypt **antes** de llamar a esta función;
   * el servicio no realiza el hash por sí mismo en este método.
   *
   * @param data - Datos del nuevo usuario (incluyendo `password` ya hasheada).
   * @returns El usuario creado con el `role` normalizado a minúsculas.
   */
  create: async (data: UserCreateInput): Promise<CustomUser> => {
    const id = uuidv4();
    const result = await sql`
      INSERT INTO users (id, name, email, password, role)
      VALUES (${id}, ${data.name}, ${data.email}, ${data.password}, ${data.role})
      RETURNING *
    `;
    const user = result[0];
    return {...user, role: user.role.toLowerCase()} as CustomUser;
  },

  /**
   * Obtiene los datos públicos de un usuario por su UUID.
   * Excluye deliberadamente el campo `password` para que no se
   * filtre en respuestas de API ni en el estado de sesión del cliente.
   *
   * @param id - UUID del usuario a buscar.
   * @returns El usuario sin contraseña, o `null` si no existe.
   */
  async getById(id: string): Promise<Omit<CustomUser, 'password'> | null> {
    const result = await sql`SELECT * FROM users WHERE id = ${id}`;
    if (result.length === 0) return null;

    const { password: _, ...user } = result[0];
    return { ...user, role: user.role.toLowerCase() } as Omit<CustomUser, 'password'>;
  },

  /**
   * Actualiza los datos modificables de un usuario existente (`name` y/o `password`).
   *
   * Si se proporciona una nueva contraseña en texto plano, esta función la hashea
   * con bcrypt (sal=10) antes de almacenarla, garantizando que nunca se guarda
   * en claro en la base de datos. Los campos no incluidos en `data` no se modifican
   * gracias al uso de `COALESCE` en la consulta SQL.
   *
   * @param id   - UUID del usuario a actualizar.
   * @param data - Campos a modificar (`name` y/o `password` en texto plano).
   * @returns El usuario actualizado sin el campo `password`.
   * @throws Error si no se proporcionan campos para actualizar o el usuario no existe.
   */
  async update(id: string, data: UpdateUserRequest): Promise<Omit<CustomUser, 'password'>> {
    // Hashear password si viene
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // Construir dinámicamente solo los campos que llegan
    const fields = Object.keys(data) as (keyof typeof data)[];

    if (fields.length === 0) throw new Error('No hay campos para actualizar');

    // Verificar que existe primero
    const exists = await sql`SELECT id FROM users WHERE id = ${id}`;
    if (exists.length === 0) throw new Error(`No record was found for an update`);

    const result = await sql`
      UPDATE users
      SET
        name     = COALESCE(${data.name ?? null}, name),
        password = COALESCE(${data.password ?? null}, password)
      WHERE id = ${id}
      RETURNING *
    `;

    const { password: _, ...user } = result[0];
    return { ...user, role: user.role.toLowerCase() } as Omit<CustomUser, 'password'>;
  }
};
