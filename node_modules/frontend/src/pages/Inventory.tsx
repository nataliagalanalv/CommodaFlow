import { HardwareCard } from '../components/HardwareCard';
import type { Hardware } from '../types/hardware.types'; 

const mockHardware: Hardware[] = [
  { 
    id: '1', 
    model: 'Nvidia RTX 4090', 
    specs: '24GB GDDR6X', 
    dailyRate: 15, 
    status: 'available' 
  },
  { 
    id: '2', 
    model: 'MacBook Pro M3', 
    specs: '32GB RAM, 1TB SSD', 
    dailyRate: 45, 
    status: 'rented' 
  },
];

export const InventoryPage = () => {
  // Ejemplo de cómo tipar una función de manejo de eventos
  const handleRent = (id: string): void => {
    console.log('Procesando alquiler para el equipo:', id);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventario de Hardware</h1>
          <p className="text-slate-500">Gestiona y supervisa los activos disponibles.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockHardware.map((item) => (
          <HardwareCard 
            key={item.id} 
            item={item} 
            onRent={handleRent} 
          />
        ))}
      </div>
    </div>
  );
};