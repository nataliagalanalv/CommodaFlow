"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user.types'; 

// 1. Definimos la forma de los datos que tendrá el contexto
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
  isAuthenticated: boolean; 
}

// 2. Creamos el Contexto (la "caja" de datos)
// Exportamos el contexto por si fuera necesario, aunque usaremos useAuth
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. El Proveedor (El componente que envuelve la app)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
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

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('commoda_user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      localStorage.removeItem('commoda_user');
      window.location.href = '/login';
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('commoda_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. El Hook (Lo que usan tus componentes como NavWrapper o RecordPage)
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    // Si estamos en el servidor (durante el build) y falla, devolvemos un estado vacío por defecto
    // para que el proceso de compilación no explote en la página 404.
    if (typeof window === 'undefined') {
      return {
        user: null,
        isLoading: true,
        isAuthenticated: false,
        login: () => {},
        logout: async () => {},
        updateUser: () => {}
      };
    }
    // Si falla en el navegador del usuario, sí lanzamos el error para enterarnos
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return context;
};