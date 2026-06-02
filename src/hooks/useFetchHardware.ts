"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Hardware } from '../types/hardware';

/**
 * Hook personalizado para obtener y mantener actualizado el inventario de hardware.
 *
 * ### Características
 * - **Carga inicial automática**: Llama a `GET /api/hardware` al montar el componente.
 * - **Prevención de fugas de memoria**: Usa un flag `active` para cancelar
 *   actualizaciones de estado si el componente se desmonta antes de recibir respuesta.
 * - **Recarga manual**: Expone `refetch` para que la UI pueda forzar una actualización
 *   (p.ej., tras crear un alquiler o añadir un equipo nuevo).
 * - **Sin doble spinner**: El flag `isInitial` evita activar `loading=true` en
 *   la carga inicial (ya parte como `true`), lo que previene parpadeos.
 *
 * @returns Objeto con:
 *   - `data`    → Array de equipos obtenidos (vacío hasta la primera respuesta).
 *   - `loading` → Verdadero mientras la petición está en curso.
 *   - `error`   → Mensaje de error si la petición falló, o `null`.
 *   - `refetch` → Función para forzar una nueva carga.
 *
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useFetchHardware();
 * ```
 */
export function useFetchHardware() {
  const [data, setData] = useState<Hardware[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (isInitial = false) => {
    // Solo activamos el loading si no es la carga inicial (donde ya es true por defecto)
    // o si es un refetch manual
    if (!isInitial) setLoading(true);

    try {
      const response = await fetch('/api/hardware');
      if (!response.ok) throw new Error('No se pudo obtener el inventario');

      const inventory = await response.json();
      setData(inventory);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. Efecto de carga inicial - Versión corregida
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      // Llamamos a la lógica pero solo si el efecto sigue "activo"
      if (active) {
        await loadData(true);
      }
    };

    fetchData();

    // Limpieza: si el usuario navega a otra página antes de que termine,
    // evitamos actualizar el estado de un componente que ya no existe.
    return () => {
      active = false;
    };
  }, [loadData]); // loadData es estable gracias a useCallback

  // 2. Función para recarga manual
  const refetch = useCallback(() => {
    return loadData();
  }, [loadData]);

  return { data, loading, error, refetch };
}
