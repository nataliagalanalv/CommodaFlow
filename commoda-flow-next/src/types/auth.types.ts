import type { users } from './user.types';

export interface AuthState {
  user: users | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string | null; 
}
export interface AuthResponse {
  user: users;
  token: string;
}