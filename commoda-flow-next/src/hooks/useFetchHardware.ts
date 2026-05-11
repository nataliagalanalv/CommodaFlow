"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Hardware } from '../types/hardware';

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