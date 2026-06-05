import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';

/**
 * Pantalla índice de la ruta raíz (`/`).
 *
 * Actúa como punto de entrada que redirige al usuario al grupo correcto según
 * su estado de sesión:
 * - Autenticado   → `/(tabs)/inventario`
 * - No autenticado → `/(auth)/login`
 *
 * ### Por qué existe
 * Los grupos de Expo Router `(auth)` y `(tabs)` no generan segmento de URL
 * propio, por lo que la ruta raíz `/` no coincidiría con ninguna pantalla.
 * En un Development Build, la app se abre vía deep link en `/`, así que esta
 * pantalla es necesaria para resolver ese arranque (en Expo Go el comportamiento
 * por defecto lo enmascaraba).
 *
 * ### Hidratación
 * Devuelve `null` mientras `isHydrated` es `false`, evitando una redirección
 * prematura antes de que Zustand restaure la sesión desde AsyncStorage.
 */
export default function Index() {
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) return null;

  return <Redirect href={isAuthenticated ? '/(tabs)/inventario' : '/(auth)/login'} />;
}
