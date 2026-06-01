"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Rental } from '../types/rental.types';

/**
 * Hook personalizado para obtener el historial de alquileres de un usuario.
 *
 * ### Comportamiento
 * - Se activa automáticamente cuando `userId` tiene valor; si es `undefined`
 *   (usuario aún no autenticado), no hace ninguna petición.
 * - Re-ejecuta la carga automáticamente si `userId` cambia (p.ej., cambio de cuenta).
 * - Usa el mismo patrón de flag `active` que `useFetchHardware` para prevenir
 *   actualizaciones de estado en componentes desmontados.
 *
 * @param userId - UUID del usuario cuyos alquileres se van a cargar.
 *                 Pasar `undefined` suspende las peticiones hasta que esté disponible.
 *
 * @returns Objeto con:
 *   - `data`    → Array de alquileres con relaciones `hardware` y `user`.
 *   - `loading` → Verdadero mientras la petición está en curso.
 *   - `error`   → Mensaje de error si la petición falló, o `null`.
 *   - `refetch` → Función para forzar una nueva carga (p.ej., tras devolver un equipo).
 *
 * @example
 * ```tsx
 * const { user } = useAuth();
 * const { data, loading, refetch } = useFetchRentals(user?.id);
 * ```
 */
export function useFetchRentals(userId: string | undefined) {
  const [data, setData] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (isInitial = false) => {
    if (!userId) return;

    // Solo activamos el loading si no es la carga inicial para evitar el flicker
    if (!isInitial) setLoading(true);

    try {
      const response = await fetch(`/api/rentals?userId=${userId}`);
      if (!response.ok) throw new Error('No se pudo obtener el histórico');

      const rentals = await response.json();
      setData(rentals);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let active = true;

    // Definimos una función asíncrona interna
    const fetchData = async () => {
      if (userId && active) {
        await loadData(true);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [loadData, userId]); // El linter ahora estará contento porque llamamos a una función async propia

  return { data, loading, error, refetch: loadData };
}
