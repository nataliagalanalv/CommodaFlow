import { useState } from 'react';
import type { Hardware } from '../types/hardware.types.ts';
import { StatusBadge } from './StatusBadge';
import { RentalModal } from './RentalModal'; // Asegúrate de importar tu modal

interface HardwareCardProps {
  item: Hardware;
  onRentalSuccess: () => void;
}

export const HardwareCard: React.FC<HardwareCardProps> = ({ item, onRentalSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Imagen del equipo */}
      <div className="h-40 bg-slate-100 flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={item.model} className="h-full w-full object-cover" />
        ) : (
          <span className="text-slate-400">Sin imagen</span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-800">{item.model}</h3>
          {/* Mantenemos tu StatusBadge original */}
          <StatusBadge status={item.status} />
        </div>
        
        <p className="text-sm text-slate-500 mb-4">{item.specs}</p>

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-indigo-600">{item.dailyRate}€/día</span>
          
          <button 
            disabled={item.status !== 'available'}
            onClick={() => setIsModalOpen(true)} // Cambiado: Ahora abre el modal
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
          >
            {item.status === 'available' ? 'Alquilar' : 'Alquilado'}
          </button>
        </div>
      </div>

      {/* Renderizamos el Modal aquí mismo */}
      <RentalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={item}
        onSuccess={onRentalSuccess} // Aquí pasamos la función de refresco que viene de la página
      />
    </div>
  );
};