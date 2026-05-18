import { createContext } from 'react';
import type { User } from '../types/user.types';

interface AuthContextType {
  user: User | null;
  updateUser: (user: User | null) => void; 
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; 
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);