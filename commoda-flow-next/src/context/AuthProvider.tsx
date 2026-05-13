"use client";

import React, { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from '../types/user.types';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const savedUser = localStorage.getItem('commoda_user');
      
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Actualizamos el estado
          setUser(parsedUser);
        } catch (error) {
          console.error("Error recuperando sesión:", error);
          localStorage.removeItem('commoda_user');
        }
      }
      
      // Finalmente quitamos el estado de carga
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('commoda_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('commoda_user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};