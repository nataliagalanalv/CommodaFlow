import { useInventory } from '../hooks/useInventory';
import { SearchBar } from '../components/SearchBar';
import { HardwareCard } from '../components/HardwareCard';
import { mockHardware } from '../data/mockData'; // Imagina que movimos los datos aquí

export const InventoryPage = () => {
  const { items, isLoading, handleSearch } = useInventory(mockHardware);

  if (isLoading) return <div className="p-8 text-center">Cargando equipos...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-3xl font-bold">Inventario</h1>
        <SearchBar onSearch={handleSearch} />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.length > 0 ? (
          items.map(item => <HardwareCard key={item.id} item={item} onRent={() => {}} />)
        ) : (
          <p className="col-span-full text-center text-slate-500">No se encontraron equipos.</p>
        )}
      </div>
    </div>
  );
};