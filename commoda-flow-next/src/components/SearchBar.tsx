"use client";

import React from 'react';

interface SearchBarProps {
  onSearch: (val: string) => void;
}

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

      {/* Indicador visual sutil a la derecha (opcional) */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2">
        <span className="hidden sm:block text-[10px] font-black text-slate-300 uppercase tracking-widest border border-slate-100 px-2 py-1 rounded-md">
          Hardware
        </span>
      </div>
    </div>
  );
};