"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../types/user.types';

/**
 * Forma del contexto de autenticación expuesto a los componentes hijos.
 * Centraliza toda la lógica de sesión para que ningún componente acceda
 * directamente a cookies, localStorage o llamadas a `/api/auth/*`.
 */
interface AuthContextType {
  /** Usuario autenticado actualmente, o `null` si no hay sesión activa. */
  user: users | null;
  /** Verdadero mientras se verifica la sesión inicial con el servidor. */
  isLoading: boolean;
  /**
   * Persiste el usuario en el estado y en localStorage tras un login exitoso.
   * No hace la llamada HTTP; el componente que llama ya habrá obtenido los datos.
   * @param userData - Datos del usuario recibidos del endpoint de login.
   */
  login: (userData: users) => void;
  /**
   * Cierra la sesión: llama a `POST /api/auth/logout` para invalidar la cookie,
   * limpia el localStorage y redirige a `/login`.
   */
  logout: () => Promise<void>;
  /**
   * Actualiza los datos del usuario en el estado y localStorage sin hacer login.
   * Se usa tras editar el perfil para que la UI refleje los cambios inmediatamente.
   * @param userData - Datos actualizados del usuario.
   */
  updateUser: (userData: users) => void;
  /**
   * Vuelve a llamar a `GET /api/auth/me` para sincronizar el estado del contexto
   * con la base de datos. Útil cuando los datos del usuario pueden haber cambiado
   * externamente (p.ej., cambio de rol por un admin).
   */
  refreshUser: () => Promise<void>;
  /** Derivado de `user !== null`. Útil para guards de componentes. */
  isAuthenticated: boolean;
}

/**
 * Contexto de React para la autenticación de CommodaFlow.
 * Exportado por si algún componente avanzado necesita consumirlo directamente,
 * aunque la forma recomendada es usar el hook `useAuth`.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Proveedor de autenticación que envuelve la aplicación completa.
 * Debe colocarse en el layout raíz para que todos los componentes tengan
 * acceso al estado de sesión.
 *
 * ### Hidratación de sesión
 * Al montarse, llama a `GET /api/auth/me` para comprobar si existe una
 * cookie de sesión válida y restaurar el estado del usuario sin necesidad
 * de que vuelva a hacer login. `isLoading` permanece `true` hasta que
 * esta comprobación termina.
 *
 * @param children - Árbol de componentes de la aplicación.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<users | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        // Si tu API devuelve { user: ... }, recuerda acceder a data.user
        setUser(data.user || data);
      }
    } catch (error) {
      console.error("Error al refrescar usuario", error);
    }
  };

  useEffect(() => {
    async function initializeAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) throw new Error("No session");
        const data = await res.json();
        setUser(data.user || data); // ← igual que refreshUser
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    initializeAuth();
  }, []);

  const login = (userData: users) => {
    setUser(userData);
    localStorage.setItem('commoda_user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error("Error en logout API", error);
    } finally {
      document.cookie = "token-commoda=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setUser(null);
      localStorage.removeItem('commoda_user');

      window.location.replace('/login');
    }
  };

  const updateUser = (userData: users) => {
    setUser(userData);
    localStorage.setItem('commoda_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser, refreshUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para consumir el contexto de autenticación.
 *
 * ### Uso
 * ```tsx
 * const { user, login, logout, isAuthenticated } = useAuth();
 * ```
 *
 * ### Manejo SSR
 * Durante el build de Next.js (contexto de servidor, `window === undefined`),
 * devuelve un estado vacío y seguro en lugar de lanzar un error, evitando
 * que páginas como `404` fallen al compilarse.
 *
 * @throws Error si se usa fuera del árbol de `AuthProvider` en el navegador.
 * @returns El valor completo del `AuthContext`.
 */
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
        updateUser: () => {},
        refreshUser: async () => {}
      };
    }
    // Si falla en el navegador del usuario, sí lanzamos el error para enterarnos
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
};
