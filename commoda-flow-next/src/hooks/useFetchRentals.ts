"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Rental } from '../types/rental.types';

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