"use client";

import React, { useState, useMemo } from 'react';
import { RentalTable } from '../../components/RentalTable';
import type { Rental } from '../../types/rental.types';

const MOCK_RENTALS: Rental[] = [
  {
    id: 'r1',
    hardwareId: 'h1',
    userId: 'u1',
    startDate: '2023-10-01',
    endDate: '2023-10-15',
    status: 'active',
    totalCost: 150,
    hardwareDetails: { model: 'MacBook Pro M2', dailyRate: 10 }
  },
  {
    id: 'r2',
    hardwareId: 'h2',
    userId: 'u1',
    startDate: '2023-09-01',
    endDate: '2023-09-05',
    status: 'returned',
    totalCost: 200,
    hardwareDetails: { model: 'Cámara Sony A7IV', dailyRate: 50 }
  }
];

export default function RecordPage() {
  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Lógica de filtrado (optimizada con useMemo)
  const filteredRentals = useMemo(() => {
    return MOCK_RENTALS.filter((rental) => {
      const modelName = rental.hardwareDetails?.model || "";
      
      const matchesName = modelName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
      
      const matchesDate = !dateFilter || rental.startDate.includes(dateFilter);

      return matchesName && matchesStatus && matchesDate;
    });
  }, [searchTerm, statusFilter, dateFilter]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1A263C] tracking-tight">
            Histórico de <span className="text-[#3D70DD]">Alquileres</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Revisa y filtra tus préstamos de hardware.</p>
        </div>
      </header>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F5F8FF] p-6 rounded-[2rem] border border-blue-50 shadow-sm">
        {/* Búsqueda por Nombre */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#3D70DD] uppercase tracking-widest ml-1">Buscar Equipo</label>
          <input 
            type="text" 
            placeholder="Ej: MacBook..." 
            className="w-full px-5 py-3 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtro por Estado */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#3D70DD] uppercase tracking-widest ml-1">Estado</label>
          <select 
            className="w-full px-5 py-3 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 shadow-sm font-medium appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="returned">Devueltos</option>
            <option value="overdue">Retrasados</option>
          </select>
        </div>

        {/* Filtro por Fecha */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#3D70DD] uppercase tracking-widest ml-1">Fecha de Inicio</label>
          <input 
            type="date" 
            className="w-full px-5 py-3 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 shadow-sm font-medium"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-black text-[#1A263C]">Resultados</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {filteredRentals.length} encontrados
          </span>
        </div>
        
        <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-blue-100/20 overflow-hidden">
          {filteredRentals.length > 0 ? (
            <RentalTable rentals={filteredRentals} />
          ) : (
            <div className="py-20 text-center space-y-3">
              <span className="text-4xl">🔍</span>
              <p className="text-slate-400 font-medium text-lg">No se encontraron registros con esos filtros.</p>
              <button 
                onClick={() => {setSearchTerm(''); setStatusFilter('all'); setDateFilter('');}}
                className="text-[#3D70DD] font-bold text-sm hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}