import React from 'react';

export type HardwareStatus = 'available' | 'rented' | 'maintenance';

interface StatusBadgeProps {
  status: HardwareStatus;
}

const statusConfig = {
  available: { 
    label: '● Disponible', 
    className: 'bg-[#E9F8F1] text-[#2BB673] border-[#2BB673]/20' 
  },
  rented: { 
    label: '○ Alquilado', 
    className: 'bg-[#F0F4FF] text-[#3D70DD] border-[#3D70DD]/20' 
  },
  maintenance: { 
    label: '⚠ Mantenimiento', 
    className: 'bg-red-50 text-red-600 border-red-100' 
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig.maintenance;
  
  return (
    <span className={`
      px-3 py-1 
      rounded-full 
      text-[10px] 
      font-black 
      uppercase 
      tracking-widest 
      border 
      shadow-sm
      transition-all
      ${config.className}
    `}>
      {config.label}
    </span>
  );
};