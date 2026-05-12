import { prisma } from '../lib/prisma';
import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const UserService = {
  // Para verificar si el email ya existe en el registro
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  // Registro: Encripta la contraseña antes de guardar
  async create(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    // Devolvemos el usuario sin la contraseña por seguridad
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async getById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }
};