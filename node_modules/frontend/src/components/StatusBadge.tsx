import React from 'react';

// Usamos el tipo exacto que definimos en la arquitectura
export type HardwareStatus = 'available' | 'rented' | 'maintenance';

interface StatusBadgeProps {
  status: HardwareStatus;
}

const statusConfig = {
  available: { label: 'Disponible', color: 'bg-green-100 text-green-800 border-green-200' },
  rented: { label: 'Alquilado', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  maintenance: { label: 'Mantenimiento', color: 'bg-red-100 text-red-800 border-red-200' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { label, color } = statusConfig[status];
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {label}
    </span>
  );
};