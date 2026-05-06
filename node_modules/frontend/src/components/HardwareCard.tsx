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
    <div 
      className="group relative bg-white rounded-[1.8rem] shadow-lg shadow-blue-200/20 border border-white 
                 transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden hover:scale-[1.02] hover:bg-[#EDF2FF] hover:shadow-2xl hover:shadow-[#3D70DD]/20 hover:border-blue-100"
    >
      {/* Área del Icono */}
      <div className="pt-8 px-8 flex justify-between items-start">
        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center p-3 shadow-sm border border-slate-50 transition-transform duration-300 group-hover:scale-110">
          <img 
            src={selectedIcon} 
            alt={item.category} 
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-3">
          <h3 className="text-xl font-extrabold text-[#1A263C] leading-tight line-clamp-1 group-hover:text-[#3D70DD] transition-colors">
            {item.model}
          </h3>
          <p className="text-slate-400 text-sm font-medium mt-1 line-clamp-2 min-h-[40px]">
            {item.specs}
          </p>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-100/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-[#3D70DD]">
              {item.dailyRate}€<span className="text-[10px] text-slate-400 font-bold ml-1">/DÍA</span>
            </span>
          </div>
          
          <button 
            disabled={!isAvailable}
            onClick={(e) => {
              e.stopPropagation(); // Evita conflictos de eventos
              setIsModalOpen(true);
            }}
            className={`px-5 py-3 rounded-xl transition-all transform active:scale-95 flex items-center gap-2 font-bold text-sm ${
              isAvailable 
                ? 'bg-[#3D70DD] text-white hover:bg-[#2F5FC7] shadow-lg shadow-blue-100' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            Gestionar
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <RentalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={item} onSuccess={onRentalSuccess} />
    </div>
  );
};