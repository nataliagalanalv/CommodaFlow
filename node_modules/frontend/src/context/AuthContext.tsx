import { createContext } from 'react';
import type { User } from '../types/user.types';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Solo exportamos el objeto Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);