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

  // 3. Obtener por ID (Prisma)
  // CAMBIO: Si quitamos el password con la desestructuración, el retorno debe ser Omit<CustomUser, 'password'>
  async getById(id: string): Promise<Omit<CustomUser, 'password'> | null> {
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) return null;
    
    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      role: userWithoutPassword.role.toLowerCase()
    } as Omit<CustomUser, 'password'>;
  },

  // 4. Actualizar usuario (Prisma)
  async update(id: string, data: Partial<Prisma.usersUpdateInput>): Promise<Omit<CustomUser, 'password'>> {
    // CAMBIO: Arriba usamos Prisma.usersUpdateInput en minúsculas

    const updateData = { ...data };

    if (updateData.password && typeof updateData.password === 'string') {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await prisma.users.update({
      where: { id },
      data: updateData,
    });

    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      role: userWithoutPassword.role.toLowerCase()
    } as Omit<CustomUser, 'password'>;
  }
};