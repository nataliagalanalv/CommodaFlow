import type { users } from './user.types';

/**
 * Estado global de autenticación usado por el contexto de React.
 * Centraliza la sesión del usuario activo en la aplicación web.
 */
export interface AuthState {
  /** Usuario autenticado actualmente, o `null` si no hay sesión activa. */
  user: users | null;
  /** Indica si el usuario ha completado el proceso de login. */
  isAuthenticated: boolean;
  /** Verdadero mientras se verifica la sesión en el servidor (montaje inicial). */
  isLoading: boolean;
  /** Mensaje de error de la última operación de autenticación fallida, si lo hay. */
  error?: string | null;
}

/**
 * Forma de la respuesta devuelta por los endpoints de autenticación
 * (`/api/auth/login`, `/api/auth/register`) cuando la operación es exitosa.
 */
export interface AuthResponse {
  /** Datos del usuario autenticado (sin contraseña). */
  user: users;
  /**
   * Token JWT de sesión.
   * En la versión web se gestiona como cookie HttpOnly en el servidor;
   * en la versión móvil se almacena en Zustand + AsyncStorage para
   * incluirlo como `Authorization: Bearer <token>` en cada petición.
   */
  token: string;
}
