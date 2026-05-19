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
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. El Hook (Lo que usan tus componentes como NavWrapper o RecordPage)
// Al estar en el mismo archivo, ya tiene acceso a AuthContext sin errores de build
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Este error es el que te saltaba en el build. 
    // Significa que intentaste usar useAuth fuera de un <AuthProvider>
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};