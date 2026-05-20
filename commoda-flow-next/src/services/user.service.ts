import { neon } from '@neondatabase/serverless';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { User, UserCreateInput } from '../types/user.types';

const sql = neon(process.env.DATABASE_URL!);

export const UserService = {
  
  // 1. Verificar existencia (Neon)
  findByEmail: async (email: string): Promise<User | null> => {
    const users = await sql`SELECT id, name, email, role FROM users WHERE email = ${email}`;
    if (users.length === 0) return null;

    const user = users[0];
    return {
      ...user,
      // Normalizamos el rol a minúsculas para que coincida con tu tipo 'admin' | 'user'
      role: user.role.toLowerCase() 
    } as User;
  },

  // 2. Crear usuario (Neon)
  create: async (data: UserCreateInput): Promise<User> => {
    const result = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${data.name}, ${data.email}, ${data.password}, ${data.role})
      RETURNING id, name, email, role
    `;
    const user = result[0];
    return {
      ...user,
      role: user.role.toLowerCase()
    } as User;
  },

  // 3. Obtener por ID (Prisma)
  async getById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    
    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      role: userWithoutPassword.role.toLowerCase()
    } as User;
  },

  // 4. Actualizar usuario (Prisma)
  async update(id: string, data: Partial<Prisma.UserUpdateInput>): Promise<Omit<User, 'password'>> {
    const updateData = { ...data };

    if (updateData.password && typeof updateData.password === 'string') {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      role: userWithoutPassword.role.toLowerCase()
    } as Omit<User, 'password'>;
  }
};