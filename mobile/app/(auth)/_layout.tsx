import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

/**
 * Layout del grupo de autenticación `(auth)`.
 *
 * Actúa como guardián de acceso inverso: si el usuario ya tiene una sesión
 * activa, redirige inmediatamente a la pantalla principal `/(tabs)/inventario`
 * para evitar que vea el formulario de login estando ya autenticado.
 *
 * ### Hidratación previa
 * Devuelve `null` mientras `isHydrated` es `false`, es decir, mientras Zustand
 * todavía está cargando el estado persistido desde AsyncStorage. Esto evita un
 * parpadeo de redirección incorrecta al arrancar la app en frío.
 *
 * @remarks
 * La redirección inversa (`isAuthenticated → tabs`) es el complemento del
 * guardián directo de `(tabs)/_layout.tsx` (`!isAuthenticated → auth`).
 * Ambos juntos garantizan que cada grupo solo sea accesible por el rol correcto.
 */
export default function AuthLayout() {
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) return null;
  if (isAuthenticated) return <Redirect href="/(tabs)/inventario" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
