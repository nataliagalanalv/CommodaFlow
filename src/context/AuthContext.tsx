"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { users } from '../types/user.types';

/**
 * Forma del contexto de autenticación expuesto a los componentes hijos.
 *
 * Desde la integración con Firebase Auth, la identidad (email/contraseña,
 * sesión persistente) la gestiona Firebase. Este contexto sincroniza el
 * estado de Firebase con el perfil del usuario almacenado en Neon DB.
 */
interface AuthContextType {
  /** Usuario autenticado (perfil de Neon DB), o `null` si no hay sesión activa. */
  user: users | null;
  /** Verdadero mientras se verifica la sesión inicial con Firebase y el backend. */
  isLoading: boolean;
  /**
   * Inicia sesión con email y contraseña usando Firebase Auth.
   * Tras autenticar en Firebase, sincroniza la cookie de sesión y el perfil
   * con el backend (`POST /api/auth/login`).
   * @param email    - Correo del usuario.
   * @param password - Contraseña del usuario.
   * @throws Error con mensaje legible si las credenciales son incorrectas.
   */
  loginWithEmail: (email: string, password: string) => Promise<void>;
  /**
   * Registra un nuevo usuario en Firebase Auth y crea su perfil en Neon DB.
   * @param name     - Nombre completo del usuario.
   * @param email    - Correo del usuario.
   * @param password - Contraseña (Firebase exige mínimo 6 caracteres).
   * @throws Error con mensaje legible si el email ya existe o la contraseña es débil.
   */
  registerWithEmail: (name: string, email: string, password: string) => Promise<void>;
  /**
   * Cierra la sesión: hace `signOut` de Firebase, invalida la cookie del
   * backend y redirige a `/login`.
   */
  logout: () => Promise<void>;
  /**
   * Actualiza los datos del usuario en el estado local sin hacer login.
   * Se usa tras editar el perfil para que la UI refleje los cambios.
   * @param userData - Datos actualizados del usuario.
   */
  updateUser: (userData: users) => void;
  /**
   * Vuelve a obtener el perfil del usuario desde el backend (`GET /api/auth/me`)
   * para sincronizar el estado con la base de datos.
   */
  refreshUser: () => Promise<void>;
  /** Derivado de `user !== null`. Útil para guards de componentes. */
  isAuthenticated: boolean;
}

/**
 * Contexto de React para la autenticación de CommodaFlow.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Traduce los códigos de error de Firebase Auth a mensajes legibles en español.
 *
 * @param code - Código de error de Firebase (p.ej. `auth/wrong-password`).
 * @returns Mensaje descriptivo para mostrar al usuario.
 */
function firebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email o contraseña incorrectos';
    case 'auth/email-already-in-use':
      return 'Este correo ya está registrado';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres';
    case 'auth/invalid-email':
      return 'El formato del email no es válido';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Inténtalo más tarde';
    default:
      return 'Error de autenticación. Inténtalo de nuevo';
  }
}

/**
 * Proveedor de autenticación que envuelve la aplicación completa.
 *
 * ### Sincronización con Firebase
 * `onAuthStateChanged` escucha los cambios de sesión de Firebase. Cuando hay
 * un usuario autenticado, obtiene su ID token, lo envía al backend para
 * establecer la cookie de sesión y recibe el perfil completo desde Neon DB.
 * `isLoading` permanece `true` hasta que esta comprobación inicial termina.
 *
 * @param children - Árbol de componentes de la aplicación.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<users | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Sincroniza la sesión de Firebase con el backend.
   * Envía el ID token a `/api/auth/login`, que valida el token, establece
   * la cookie de sesión y devuelve el perfil del usuario desde Neon DB.
   */
  const syncSession = async (idToken: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    if (!res.ok) throw new Error('No se pudo sincronizar la sesión');
    const data = await res.json();
    setUser(data.user);
  };

  // Escucha los cambios de estado de autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();
          await syncSession(idToken);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error sincronizando sesión:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      await syncSession(idToken);
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code ?? '';
      throw new Error(firebaseErrorMessage(code));
    }
  };

  const registerWithEmail = async (name: string, email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      // Crear el perfil en Neon DB con el nombre y establecer la sesión
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Error al crear el perfil');
      }
      const data = await res.json();
      setUser(data.user);
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code ?? '';
      // Si es un error de Firebase usamos su traducción; si no, propagamos el mensaje
      if (code) throw new Error(firebaseErrorMessage(code));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setUser(null);
      window.location.replace('/login');
    }
  };

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      }
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
    }
  };

  const updateUser = (userData: users) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithEmail,
        registerWithEmail,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para consumir el contexto de autenticación.
 *
 * ### Manejo SSR
 * Durante el build de Next.js (`window === undefined`), devuelve un estado
 * vacío y seguro en lugar de lanzar un error, evitando que páginas como la
 * 404 fallen al compilarse.
 *
 * @throws Error si se usa fuera del árbol de `AuthProvider` en el navegador.
 * @returns El valor completo del `AuthContext`.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    if (typeof window === 'undefined') {
      return {
        user: null,
        isLoading: true,
        isAuthenticated: false,
        loginWithEmail: async () => {},
        registerWithEmail: async () => {},
        logout: async () => {},
        updateUser: () => {},
        refreshUser: async () => {},
      };
    }
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
};
