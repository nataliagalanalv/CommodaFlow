import { Role } from "@prisma/client";

export interface users {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
}
export type UserCreateInput = Omit<users, 'id' | 'avatarUrl'> & { password: string };
export type UpdateUserRequest = Partial<Omit<users, 'id' | 'email' | 'role'>>;