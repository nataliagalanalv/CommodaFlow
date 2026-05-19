"use client";

import React, { useState, useMemo } from 'react';
import { RentalTable } from '../../components/RentalTable';
import { useFetchRentals } from '../../hooks/useFetchRentals'; 
import { useAuth } from '@/src/hooks/useAuth';

export default function RecordPage() {
  const { user } = useAuth(); 
  const userId = user?.id;
  
  const { data: rentals, loading: isLoading, error } = useFetchRentals(userId);
  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Lógica de filtrado
  const filteredRentals = useMemo(() => {
    return rentals.filter((rental) => {
      const modelName = rental.hardware?.model || "";
      const matchesName = modelName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
      const matchesDate = !dateFilter || rental.startDate.includes(dateFilter);
      return matchesName && matchesStatus && matchesDate;
    });
  }, [rentals, searchTerm, statusFilter, dateFilter]);

    if (!userId) {
        return (
          <div className="py-20 text-center text-slate-400">
              Debes iniciar sesión para ver tu historial.
          </div>
        );
    }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">

      {/* Tabla de Resultados adaptada al hook */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-black text-[#1A263C]">Resultados</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {!isLoading && !error ? filteredRentals.length : 0} encontrados
          </span>
        </div>
        
        <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-blue-100/20 overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="animate-spin text-4xl inline-block">⏳</div>
              <p className="text-slate-400 font-medium text-lg">Cargando histórico...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center space-y-3">
              <span className="text-4xl">⚠️</span>
              <p className="text-red-500 font-medium text-lg">{error}</p>
            </div>
          ) : filteredRentals.length > 0 ? (
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