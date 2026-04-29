import { useState } from 'react';
import type { Hardware, HardwareCategory } from '../types/hardware.types.ts';
import { StatusBadge } from './StatusBadge';
import { RentalModal } from './RentalModal'; 


import Laptop_icon from '../assets/Laptop_icon.png';
import TabletIcon from '../assets/Tablet_icon.png';
import PeripheralIcon from '../assets/Peripheral_icon.png';

const iconMap: Record<HardwareCategory, string> = {
  laptop: Laptop_icon,
  tablet: TabletIcon,
  peripheral: PeripheralIcon,
};

export const HardwareCard: React.FC<{ item: Hardware; onRentalSuccess: () => void }> = ({ item, onRentalSuccess }) => {
  const selectedIcon = iconMap[item.category] || PeripheralIcon;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAvailable = item.status === 'available';

  return (
    <div className="group bg-white rounded-[1.8rem] shadow-lg shadow-blue-200/20 border border-white hover:shadow-xl hover:shadow-[#3D70DD]/10 transition-all duration-300 flex flex-col h-full">
      
      {/* Área del Icono */}
      <div className="pt-6 px-6 flex justify-between items-start">
        {/* Contenedor del icono con fondo suave y efecto hover */}
        <div className="w-16 h-16 bg-[#F5F8FF] rounded-3xl flex items-center justify-center p-3 transition-transform duration-300 group-hover:scale-105">
          <img 
            src={selectedIcon} 
            alt={item.category} 
            /* ✅ RESALTADO: Sombra suave al icono (drop-shadow) para dar relieve ✅ */
            className="w-full h-full object-contain drop-shadow-md brightness-95"
          />
          </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="text-lg font-extrabold text-[#1A263C] leading-tight line-clamp-1 group-hover:text-[#3D70DD] transition-colors">
            {item.model}
          </h3>
          <p className="text-slate-400 text-xs font-medium mt-1 line-clamp-2 min-h-[32px]">
            {item.specs}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-black text-[#3D70DD]">
              {item.dailyRate}€<span className="text-[10px] text-slate-400 font-bold ml-1">/DÍA</span>
            </span>
          </div>
          
          <button 
            disabled={!isAvailable}
            onClick={() => setIsModalOpen(true)}
            className={`p-2.5 rounded-xl transition-all transform active:scale-90 ${
              isAvailable 
                ? 'bg-[#3D70DD] text-white hover:bg-[#2F5FC7] shadow-md shadow-blue-100' 
                : 'bg-slate-50 text-slate-300 cursor-not-allowed shadow-none'
            }`}
            title="Gestionar Alquiler"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <RentalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={item} onSuccess={onRentalSuccess} />
    </div>
  );
};