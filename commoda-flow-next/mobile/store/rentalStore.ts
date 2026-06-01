import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rental } from '../types';

/**
 * Forma del store de alquileres de la aplicación móvil.
 */
interface RentalStore {
  /** Lista de alquileres del usuario cargados desde la API. */
  items: Rental[];
  /** Verdadero mientras se está cargando el historial desde la API. */
  isLoading: boolean;
  /** Mensaje de error de la última petición fallida, o `null` si no hay error. */
  error: string | null;
  /** Texto de búsqueda libre para filtrar alquileres localmente. */
  searchQuery: string;
  /**
   * Reemplaza el array completo de alquileres con los datos frescos de la API.
   * @param items - Array de alquileres obtenido de `GET /api/rentals?userId=<id>`.
   */
  setItems: (items: Rental[]) => void;
  /**
   * Actualiza el indicador de carga.
   * @param loading - `true` al iniciar una petición, `false` al terminar.
   */
  setLoading: (loading: boolean) => void;
  /**
   * Establece o limpia el mensaje de error.
   * @param error - Mensaje descriptivo del error, o `null` para limpiar.
   */
  setError: (error: string | null) => void;
  /**
   * Actualiza el texto de búsqueda local.
   * @param query - Texto introducido por el usuario.
   */
  setSearchQuery: (query: string) => void;
  /**
   * Devuelve los alquileres filtrados por el `searchQuery` actual.
   * Busca coincidencias en el modelo del hardware, el nombre del usuario y el estado.
   * Si `searchQuery` está vacío, devuelve todos los alquileres.
   *
   * @returns Array de alquileres que coinciden con el texto de búsqueda.
   */
  filteredItems: () => Rental[];
}

/**
 * Store del historial de alquileres de la aplicación móvil CommodaFlow.
 *
 * Centraliza el estado de los alquileres del usuario, la carga y los errores.
 *
 * ### Persistencia
 * Solo se persiste `items` en AsyncStorage (bajo `commoda-rentals-storage`).
 * Los estados transitorios (`isLoading`, `error`, `searchQuery`) no se persisten.
 *
 * ### Uso típico
 * ```tsx
 * const { items, setItems, isLoading, error } = useRentalStore();
 * ```
 */
export const useRentalStore = create<RentalStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      searchQuery: '',
      setItems: (items) => set({ items }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      filteredItems: () => {
        const { items, searchQuery } = get();
        if (!searchQuery.trim()) return items;
        const q = searchQuery.toLowerCase();
        return items.filter(
          (r) =>
            r.hardware?.model.toLowerCase().includes(q) ||
            r.user?.name.toLowerCase().includes(q) ||
            r.status.toLowerCase().includes(q)
        );
      },
    }),
    {
      name: 'commoda-rentals-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persiste 'items'; el resto son estados transitorios
      partialize: (state) => ({ items: state.items }),
    }
  )
);
