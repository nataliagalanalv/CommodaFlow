"use client";

import React from 'react';

/** Alias para los posibles estados de un equipo de hardware. */
export type HardwareStatus = 'available' | 'rented' | 'maintenance';

/**
 * Props del componente `StatusBadge`.
 */
interface StatusBadgeProps {
  /**
   * Estado del equipo a mostrar.
   * Acepta tanto minúsculas (`'available'`) como mayúsculas (`'AVAILABLE'`)
   * ya que el componente normaliza internamente antes de buscar la configuración.
   */
  status: HardwareStatus | string;
}

/**
 * Configuración visual por estado.
 * Cada entrada define la etiqueta de texto y las clases Tailwind de color
 * (fondo, texto y borde) para mantener consistencia visual entre todos
 * los lugares donde aparece el badge.
 */
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

/**
 * Badge de estado visual para un equipo de hardware.
 *
 * Muestra una pastilla de color con la etiqueta del estado actual del equipo.
 * Es tolerante a la casing de la base de datos (normaliza a minúsculas)
 * y usa `maintenance` como estado de fallback para valores desconocidos.
 *
 * @param status - Estado del equipo (acepta mayúsculas o minúsculas).
 */
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
