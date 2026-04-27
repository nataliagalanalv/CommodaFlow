import { useInventory } from '../hooks/useInventory';
import { SearchBar } from '../components/SearchBar';
import { HardwareCard } from '../components/HardwareCard';

export const InventoryPage = () => {
  // 1. Extraemos handleSearch y refreshInventory del hook
  const { items, isLoading, handleSearch, refreshInventory } = useInventory();

  if (isLoading) return <div className="p-8 text-center">Cargando inventario...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* --- EL HEADER: Aquí es donde vive el buscador --- */}
      <header className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-3xl font-bold">Inventario</h1>
        
        {/* 2. Conectamos el prop onSearch con la función handleSearch */}
        <SearchBar onSearch={handleSearch} />
      </header>

      {/* --- LA GRILLA: Donde se muestran los resultados --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items && items.length > 0 ? (
          items.map(item => (
            <HardwareCard 
              key={item.id} 
              item={item} 
              onRentalSuccess={refreshInventory} // 3. Pasamos el refresco
            />
          ))
        ) : (
          <p className="col-span-full text-center text-slate-500">
            No se encontraron equipos que coincidan con tu búsqueda.
          </p>
        )}
      </div>
    </div>
  );
};