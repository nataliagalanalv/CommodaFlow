import { Role } from "@prisma/client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}
export type UserCreateInput = Omit<User, 'id' | 'avatarUrl'> & { password: string };