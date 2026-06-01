import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Hardware } from '../types';

/**
 * Forma del store de inventario de hardware de la aplicación móvil.
 */
interface HardwareStore {
  /** Lista completa de equipos cargados desde la API. */
  items: Hardware[];
  /** Verdadero mientras se está cargando el inventario desde la API. */
  isLoading: boolean;
  /** Mensaje de error de la última petición fallida, o `null` si no hay error. */
  error: string | null;
  /** Texto de búsqueda libre para filtrar equipos sin petición adicional a la API. */
  searchQuery: string;
  /**
   * Reemplaza el array completo de equipos con los datos frescos de la API.
   * @param items - Array de equipos obtenido de `GET /api/hardware`.
   */
  setItems: (items: Hardware[]) => void;
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
   * Devuelve los equipos filtrados por el `searchQuery` actual.
   * Busca coincidencias en `model`, `category` y `specs`.
   * Si `searchQuery` está vacío, devuelve todos los equipos.
   *
   * @returns Array de equipos que coinciden con el texto de búsqueda.
   */
  filteredItems: () => Hardware[];
}

/**
 * Store del inventario de hardware de la aplicación móvil CommodaFlow.
 *
 * Centraliza el estado de los equipos, la carga y los errores para que
 * la pantalla de Inventario pueda leer y actualizar datos sin prop drilling.
 *
 * ### Persistencia
 * Solo se persiste `items` en AsyncStorage (bajo `commoda-hardware-storage`)
 * para que el inventario sea visible offline. El estado de `isLoading` y
 * `error` no se persiste porque son transitorios.
 *
 * ### Uso típico
 * ```tsx
 * const { items, setItems, setLoading, setError, isLoading } = useHardwareStore();
 * ```
 */
export const useHardwareStore = create<HardwareStore>()(
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
          (h) =>
            h.model.toLowerCase().includes(q) ||
            h.category.toLowerCase().includes(q) ||
            h.specs.toLowerCase().includes(q)
        );
      },
    }),
    {
      name: 'commoda-hardware-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persiste 'items'; isLoading, error y searchQuery son transitorios
      partialize: (state) => ({ items: state.items }),
    }
  )
);
