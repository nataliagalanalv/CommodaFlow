import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

/**
 * Forma del store de autenticación de la aplicación móvil.
 */
interface AuthStore {
  /** Usuario autenticado actualmente, o `null` si no hay sesión. */
  user: User | null;
  /**
   * Token de autenticación incluido en la cabecera `Authorization: Bearer <token>`
   * de todas las peticiones a la API. Se almacena en AsyncStorage para persistir
   * entre sesiones de la aplicación.
   */
  token: string | null;
  /** Verdadero cuando el usuario tiene una sesión activa. */
  isAuthenticated: boolean;
  /**
   * Verdadero después de que Zustand ha rehidratado el store desde AsyncStorage.
   * Los layouts de Expo Router usan este flag para mostrar un splash o null
   * mientras los datos persisten se cargan, evitando redirecciones prematuras.
   */
  isHydrated: boolean;
  /**
   * Establece el usuario y token tras un login exitoso.
   * @param user  - Datos del usuario autenticado.
   * @param token - Token de acceso para las peticiones a la API.
   */
  setAuth: (user: User, token: string) => void;
  /**
   * Actualiza los datos del usuario sin cambiar el token.
   * Se usa tras editar el perfil para reflejar los cambios en la UI.
   * @param user - Datos actualizados del usuario.
   */
  updateUser: (user: User) => void;
  /** Cierra la sesión limpiando usuario y token del estado y de AsyncStorage. */
  logout: () => void;
  /**
   * Marca el store como hidratado.
   * Llamado automáticamente por el callback `onRehydrateStorage` de Zustand
   * cuando la rehidratación desde AsyncStorage ha completado.
   */
  setHydrated: () => void;
}

/**
 * Store de autenticación de la aplicación móvil CommodaFlow.
 *
 * Gestiona la sesión del usuario con persistencia en AsyncStorage para que
 * la sesión sobreviva cierres y reaperturas de la aplicación.
 *
 * ### Persistencia
 * Toda la slice se persiste en AsyncStorage bajo la clave `commoda-auth-storage`.
 * El middleware `persist` de Zustand gestiona la serialización/deserialización
 * y llama a `setHydrated()` cuando el proceso de rehidratación termina.
 *
 * ### Uso típico
 * ```tsx
 * const { user, token, setAuth, logout } = useAuthStore();
 * ```
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      updateUser: (user) => set({ user }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'commoda-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
