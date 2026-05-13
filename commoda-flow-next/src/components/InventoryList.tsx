"use client";

import { useFetchHardware } from '../hooks/useFetchHardware';
import { Hardware } from '../types/hardware';
import { HardwareCard } from './HardwareCard';

interface InventoryListProps {
  search: string;
}

export function InventoryList({ search = '' }: InventoryListProps) {
  const { data, loading, error, refetch } = useFetchHardware();

  // 2. Lógica de filtrado reactivo
  const filteredData = data.filter((item) => {
    const searchTerm = search.toLowerCase();
    return (
      item.model.toLowerCase().includes(searchTerm) ||
      item.specs.toLowerCase().includes(searchTerm)
    );
  });

  // 3. Estado: CARGA
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-20 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#3D70DD]"></div>
        <p className="text-[#1A263C] font-black uppercase tracking-widest text-xs animate-pulse">
          Sincronizando Inventario...
        </p>
      </div>
    );
  }

  // 4. Estado: ERROR
  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-100 p-10 rounded-[3rem] text-center my-10">
        <span className="text-5xl mb-4 block">📡</span>
        <h3 className="text-[#1A263C] text-xl font-black mb-2">Error de Conexión</h3>
        <p className="text-red-600 font-medium mb-6">{error}</p>
        <button 
          onClick={refetch}
          className="px-8 py-3 bg-[#1A263C] text-white rounded-2xl font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-red-200"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  // 5. Estado: ÉXITO
  return (
    <div className="space-y-12">
      {/* ENCABEZADO MODERNO */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2">
        <div>
          <h2 className="text-4xl font-black text-[#1A263C] tracking-tight">
            Equipos <span className="text-[#3D70DD]">Disponibles</span>
          </h2>
          <p className="text-slate-400 font-medium mt-1">
            {search 
              ? `Resultados para: "${search}"` 
              : "Explora nuestro catálogo actualizado en tiempo real."}
          </p>
        </div>
        
        <button 
          onClick={refetch} 
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#3D70DD] hover:text-[#1A263C] transition-all bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-100 active:scale-95"
        >
          <svg 
            className="w-4 h-4 group-active:rotate-180 transition-transform duration-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </header>

      {/* RENDERIZADO CONDICIONAL DEL GRID (4 COLUMNAS) */}
      {filteredData.length === 0 ? (
        <div className="bg-[#F5F8FF]/50 border-2 border-dashed border-blue-100 rounded-[3.5rem] p-24 text-center">
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">
            {search 
              ? "No hay coincidencias para tu búsqueda" 
              : "No se han encontrado equipos activos"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredData.map((item) => (
            <HardwareCard 
              key={item.id} 
              item={item} 
              onRentalSuccess={refetch} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
