"use client";

import React from 'react';

/**
 * Props del componente `FilterBar`.
 * Todos los valores y setters se reciben del componente padre para mantener
 * el estado de filtros centralizado y poder usarlos en otros componentes.
 */
interface FilterBarProps {
  /** Categoría actualmente seleccionada. */
  category: string;
  /** Setter de categoría. */
  setCategory: (val: string) => void;
  /** Rango de precio actualmente seleccionado. */
  priceRange: string;
  /** Setter de rango de precio. */
  setPriceRange: (val: string) => void;
  /** Estado de disponibilidad actualmente seleccionado. */
  status: string;
  /** Setter de estado de disponibilidad. */
  setStatus: (val: string) => void;
}

/**
 * Barra de filtros para el inventario y el historial de alquileres.
 *
 * Presenta tres selectores en línea para filtrar equipos por:
 * - **Categoría**: Todas | Portátiles | Tablets | Periféricos.
 * - **Disponibilidad**: Todos | Disponible | Alquilado.
 * - **Rango de precio**: Cualquier precio | <25€ | 25-50€ | 50-100€ | >100€/día.
 *
 * Un botón "Limpiar" restablece todos los filtros a `'all'` con una sola acción.
 * El componente es completamente controlado (sin estado interno).
 *
 * @remarks
 * Se usa tanto en `HomePage` (inventario) como en `RecordPage` (historial),
 * con el mismo contrato de props en ambos casos.
 */
export const FilterBar = ({
  category, setCategory,
  priceRange, setPriceRange,
  status, setStatus
}: FilterBarProps) => {

  /** Clase base compartida por todos los `<select>` de la barra. */
  const selectStyle = "bg-[#F5F8FF] border-none rounded-xl px-4 py-2 text-xs font-bold text-[#1A263C] focus:ring-2 focus:ring-[#3D70DD] outline-none cursor-pointer appearance-none transition-all";

  return (
    <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">

      {/* Filtro: Categoría */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoría</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectStyle}>
          <option value="all">Todas</option>
          <option value="LAPTOP">Portátiles</option>
          <option value="TABLET">Tablets</option>
          <option value="PERIPHERAL">Periféricos</option>
        </select>
      </div>

      {/* Filtro: Estado */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Disponibilidad</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectStyle}>
          <option value="all">Todos</option>
          <option value="available">Disponible</option>
          <option value="rented">Alquilado</option>
        </select>
      </div>

      {/* Filtro: Precio */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Rango de Precio</label>
        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className={selectStyle}>
          <option value="all">Cualquier precio</option>
          <option value="under25">Menos de 25€/día</option>
          <option value="25-50">25€ - 50€/día</option>
          <option value="50-100">50€ - 100€/día</option>
          <option value="over100">Más de 100€/día</option>
        </select>
      </div>

      {/* Botón Reset */}
      <button
        onClick={() => { setCategory('all'); setPriceRange('all'); setStatus('all'); }}
        className="mt-auto mb-1 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
      >
        Limpiar
      </button>
    </div>
  );
};
