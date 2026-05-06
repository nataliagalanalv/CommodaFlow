import { useState, useMemo } from 'react';
import { useFetchHardware } from '../hooks/useFetchHardware';
import { SearchBar } from '../components/SearchBar';
import { HardwareCard } from '../components/HardwareCard';
import type { APIHardware, Hardware } from '../types/hardware.types';

export const InventoryPage = () => {
  const { data, loading, error, refetch } = useFetchHardware();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    const rawData = (data as APIHardware[]) || [];
    
    // 2. Procesamos los items para que React no tenga problemas con los IDs
    const processedItems: Hardware[] = rawData.map((item: APIHardware): Hardware => {
    const id = item.id || (item as unknown as { _id: string })._id;

    return {
        ...item,
      id: id,
      // Aseguramos que la categoría sea válida según tu tipo HardwareCategory
      category: item.category || 'peripheral'
    };
  });

    // 3. Filtramos por búsqueda
    if (!searchTerm.trim()) return processedItems;

    return processedItems.filter(item => 
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.specs?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  // --- RENDERIZADO (Estados de carga y error se mantienen igual) ---
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-[#3D70DD]/20 border-t-[#3D70DD] rounded-full animate-spin"></div>
      <p className="text-[#1A263C] font-bold animate-pulse uppercase tracking-widest text-[10px]">
        Sincronizando Inventario...
      </p>
    </div>
  );
  
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 max-w-md shadow-sm">
        <span className="text-4xl mb-4 block">⚠️</span>
        <h3 className="text-[#1A263C] font-black text-xl mb-2">Error de conexión</h3>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <button onClick={refetch} className="bg-[#3D70DD] ...">Reintentar ahora</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-10 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black text-[#1A263C]">
            <span className="text-[#3D70DD]">Inventario</span>
          </h1>
        </div>
        <div className="w-full md:w-[400px]">
          <SearchBar onSearch={setSearchTerm} />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <HardwareCard key={item.id} item={item} onRentalSuccess={refetch} />
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              No hay equipos disponibles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};