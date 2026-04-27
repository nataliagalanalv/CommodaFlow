import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Hardware } from '../types/hardware.types';

export const useInventory = () => {
  const [items, setItems] = useState<Hardware[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Nueva función para cargar datos desde el Backend
  // La definimos fuera para poder reutilizarla (refrescar)
  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/hardware');
      if (!response.ok) throw new Error('Error al conectar con el servidor');
      
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("❌ Error cargando inventario:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Lanzamos la carga al montar el componente
  useEffect(() => {
  let isMounted = true; // 1. Iniciamos el rastro

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/hardware');
      if (!response.ok) throw new Error('Error en el servidor');
      const data = await response.json();

      // 2. SOLO actualizamos el estado si el componente sigue existiendo
      if (isMounted) {
        setItems(data);
        setIsLoading(false);
      }
    } catch (error) {
      if (isMounted) {
        console.error("❌ Error:", error);
        setIsLoading(false);
      }
    }
  };

  loadData();

  // 3. Función de limpieza: se ejecuta cuando el usuario se va de la página
  return () => {
    isMounted = false; 
  };
}, []); // Array vacío para que solo se ejecute al montar

  // 2. useMemo: Se mantiene igual, filtrando los datos que vienen de la API
  const filteredItems = useMemo(() => {
    console.log('Filtrando inventario real...');
    return items.filter(item => 
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // Usamos opcional (?) por si specs viene indefinido de la API
      item.specs?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, items]);

  // 3. useCallback: Seguimos estabilizando la búsqueda
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return {
    items: filteredItems,
    isLoading,
    handleSearch,
    searchTerm,
    refreshInventory: fetchInventory // <--- Importante para actualizar tras alquilar
  };
};