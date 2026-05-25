import { neon } from '@neondatabase/serverless';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { users as CustomUser, UserCreateInput } from '../types/user.types';
import { v4 as uuidv4 } from 'uuid';

const sql = neon(process.env.DATABASE_URL!);

export const UserService = {
  
  // 1. Verificar existencia (Neon)
  findByEmail: async (email: string): Promise<CustomUser | null> => {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (result.length === 0) return null;

    const user = result[0];
    return {...user, role: user.role.toLowerCase() } as CustomUser;
  },

  // 2. Crear usuario (Neon)
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

 // 3. Obtener por ID (Neon - consistente con create)
async getById(id: string): Promise<Omit<CustomUser, 'password'> | null> {
  const result = await sql`SELECT * FROM users WHERE id = ${id}`;
  if (result.length === 0) return null;
  
  const { password: _, ...user } = result[0];
  return { ...user, role: user.role.toLowerCase() } as Omit<CustomUser, 'password'>;
},

// 4. Actualizar usuario (Neon - consistente con create)
async update(id: string, data: Partial<UserCreateInput>): Promise<Omit<CustomUser, 'password'>> {
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