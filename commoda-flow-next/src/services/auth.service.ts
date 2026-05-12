import bcrypt from 'bcryptjs';
import { UserService } from './user.service';
import { User } from '@prisma/client';

export const AuthService = {
  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const user = await UserService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  }
};