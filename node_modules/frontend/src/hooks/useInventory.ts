import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Hardware } from '../types/hardware.types';

export const useInventory = (initialData: Hardware[]) => {
  const [items, setItems] = useState<Hardware[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. useEffect: Simulamos una carga de API al montar el componente
  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(initialData);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer); // Limpieza
  }, [initialData]);

  // 2. useMemo: Filtramos la lista solo si cambia el término o los items
  // Es "costoso" porque recorre todo el array cada vez que escribes
  const filteredItems = useMemo(() => {
    console.log('Filtrando inventario...');
    return items.filter(item => 
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.specs.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, items]);

  // 3. useCallback: Estabilizamos la función de búsqueda
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return {
    items: filteredItems,
    isLoading,
    handleSearch,
    searchTerm
  };
};