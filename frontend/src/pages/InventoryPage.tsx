import { useState, useMemo } from 'react';
import { useFetchHardware } from '../hooks/useFetchHardware';
import { SearchBar } from '../components/SearchBar';
import { HardwareCard } from '../components/HardwareCard';
import type { APIHardware, Hardware, HardwareCategory } from '../types/hardware.types';

export const InventoryPage = () => {
  const { data, loading, error, refetch } = useFetchHardware();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    const rawData = (data as APIHardware[]) || [];
    const processedItems: Hardware[] = rawData.map((item): Hardware => {
      let category: HardwareCategory = 'peripheral';
      const modelLower = item.model.toLowerCase();

      if (modelLower.includes('tab') || modelLower.includes('ipad')) {
        category = 'tablet';
      } else if (
        modelLower.includes('mac') || 
        modelLower.includes('lap') || 
        modelLower.includes('pc') || 
        modelLower.includes('thinkpad')
      ) {
        category = 'laptop';
      }
      return {
        ...item,
        category
      };
    });

    return processedItems.filter(item => 
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.specs?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  // --- ESTADOS DE CARGA Y ERROR (Estética Premium) ---
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
        <button 
          onClick={refetch} 
          className="bg-[#3D70DD] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#2F5FC7] transition-all shadow-lg shadow-blue-100 active:scale-95"
        >
          Reintentar ahora
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-[#1A263C] tracking-tight">
            Mi <span className="text-[#3D70DD]">Inventario</span>
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#2BB673]"></div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">
              CommodaFlow Systems v1.2
            </p>
          </div>
        </div>
        
        <div className="w-full md:w-[400px]">
          <SearchBar onSearch={setSearchTerm} />
        </div>
      </header>

      {/* --- GRILLA DE HARDWARE (4 columnas en PC) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <HardwareCard 
              key={item.id} 
              item={item} 
              onRentalSuccess={refetch} 
            />
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6 grayscale opacity-50">
              🔍
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              No hay coincidencias para "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};