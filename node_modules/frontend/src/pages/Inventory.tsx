import { useState } from 'react';
import { HardwareCard } from '../components/HardwareCard';
import { RentalModal } from '../components/RentalModal'; // Importamos el modal
import type { Hardware } from '../types/hardware.types';

const mockHardware: Hardware[] = [
  { id: '1', model: 'Nvidia RTX 4090', specs: '24GB GDDR6X', dailyRate: 15, status: 'available' },
  { id: '2', model: 'MacBook Pro M3', specs: '32GB RAM, 1TB SSD', dailyRate: 45, status: 'rented' },
];

export const InventoryPage = () => {
  // Estado para controlar qué equipo queremos alquilar
  const [selectedHardware, setSelectedHardware] = useState<Hardware | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenRental = (item: Hardware) => {
    setSelectedHardware(item);
    setIsModalOpen(true);
  };

  const handleCloseRental = () => {
    setIsModalOpen(false);
    setSelectedHardware(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Inventario</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockHardware.map((item) => (
          <HardwareCard 
            key={item.id} 
            item={item} 
            // Pasamos la función que abre el modal con los datos del item
            onRent={() => handleOpenRental(item)} 
          />
        ))}
      </div>

      {/* Renderizado condicional del Modal */}
      {selectedHardware && (
        <RentalModal 
          item={selectedHardware} 
          isOpen={isModalOpen} 
          onClose={handleCloseRental} 
        />
      )}
    </div>
  );
};