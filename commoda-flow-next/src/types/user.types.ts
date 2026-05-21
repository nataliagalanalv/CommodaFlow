import { Role } from "@prisma/client";

export interface users {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}
export type UserCreateInput = Omit<users, 'id' | 'avatarUrl'> & { password: string };