import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { Hardware } from '../api/types';

export function useFetchHardware() {
  const [data, setData] = useState<Hardware[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Función para recarga manual (disparada por eventos, no por el efecto)
  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const inventory = await api.getHardware();
      setData(inventory);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al recargar');
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Efecto de carga inicial
  useEffect(() => {
    let isMounted = true; // Control de limpieza

    // Definimos la carga interna para no disparar el linter
    async function loadData() {
      try {
        const inventory = await api.getHardware();
        if (isMounted) {
          setData(inventory);
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error de conexión');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []); // El array vacío asegura que solo corra una vez al montar

  return { data, loading, error, refetch };
}