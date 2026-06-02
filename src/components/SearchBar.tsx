"use client";

import React from 'react';

/**
 * Props del componente `SearchBar`.
 */
interface SearchBarProps {
  /**
   * Callback invocado cada vez que el usuario escribe en el campo.
   * Recibe el valor actual del input para que el padre actualice el estado de búsqueda.
   * @param val - Texto introducido por el usuario.
   */
  onSearch: (val: string) => void;
}

/**
 * Barra de búsqueda de texto libre para el inventario y el historial.
 *
 * Campo de entrada sin debounce (la búsqueda es instantánea) con un icono
 * de lupa en color corporativo. Al recibir el foco, el icono escala ligeramente
 * para reforzar el estado activo.
 *
 * El componente es **no controlado** respecto a su valor: no gestiona el estado
 * del texto internamente; delega completamente en el callback `onSearch` del padre.
 *
 * @param onSearch - Función del padre que actualiza el término de búsqueda.
 */
export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <div className="relative max-w-xl w-full group">
      {/* Icono de búsqueda con color corporativo */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D70DD] z-10 transition-transform group-focus-within:scale-110">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="text"
        placeholder="Buscar por modelo o especificaciones..."
        className="w-full pl-14 pr-6 py-4 bg-[#F5F8FF] border-2 border-transparent rounded-[2rem] text-[#1A263C] font-bold outline-none transition-all placeholder:text-slate-300 placeholder:font-medium focus:bg-white focus:border-[#3D70DD]/20 focus:shadow-xl focus:shadow-blue-900/5"
        onChange={(e) => onSearch(e.target.value)}
      />

    </div>
  );
};
