"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user.types'; 

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Inicialización: Preguntamos a la API quién es el usuario (vía Cookie)
  useEffect(() => {
    async function initializeAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            // Opcional: Sincronizar localStorage por si lo usas en otras partes
            localStorage.setItem('commoda_user', JSON.stringify(data.user));
          }
        }
      } catch (err) {
        console.error("No hay sesión activa");
        localStorage.removeItem('commoda_user');
      } finally {
        setIsLoading(false);
      }
    }
    initializeAuth();
  }, []);

  // 2. Función Login: Se llama desde el formulario de Login
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('commoda_user', JSON.stringify(userData));
  };

  // 3. Función Logout: ¡Ahora debe ser Async para borrar la cookie!
  const logout = async () => {
    try {
      // Llamamos a una ruta de api que borre la cookie (la crearemos ahora)
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      localStorage.removeItem('commoda_user');
      window.location.href = '/login'; // Redirigir al login
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('commoda_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};