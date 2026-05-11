"use client";

import React from 'react';

export type HardwareStatus = 'available' | 'rented' | 'maintenance';

interface StatusBadgeProps {
  status: HardwareStatus | string; // Permitimos string por si viene de la DB así
}

const statusConfig: Record<string, { label: string; className: string }> = {
  available: { 
    label: '● Disponible', 
    className: 'bg-[#E9F8F1] text-[#2BB673] border-[#D1F2E1]' 
  },
  rented: { 
    label: '○ Alquilado', 
    className: 'bg-[#EDF2FF] text-[#3D70DD] border-[#DBE4FF]' 
  },
  maintenance: { 
    label: '⚠ Taller', 
    className: 'bg-[#FFF5F5] text-[#FF4D4D] border-[#FFE3E3]' 
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Normalizamos a minúsculas para evitar errores si en la DB viene como 'AVAILABLE'
  const normalizedStatus = status?.toLowerCase() || 'maintenance';
  const config = statusConfig[normalizedStatus] || statusConfig.maintenance;
  
  return (
    <span className={`
      inline-flex items-center
      px-3 py-1.5 
      rounded-xl 
      text-[9px] 
      font-black 
      uppercase 
      tracking-[0.15em] 
      border 
      shadow-sm
      transition-all duration-300
      ${config.className}
    `}>
      {config.label}
    </span>
  );
};