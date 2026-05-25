"use client";

import React, { useState, useMemo } from 'react';
import { RentalTable } from '../../components/RentalTable';
import { useFetchRentals } from '../../hooks/useFetchRentals'; 
import { useAuth } from '../../context/AuthContext'; 
import { FilterBar } from '@/components/FilterBar';
import { SearchBar } from '@/components/SearchBar';
import type { Rental } from '@/types/rental.types'; 
import {BackButton} from '@/components/BackButton';

export default function RecordPage() {
  const { user } = useAuth(); 
  const userId = user?.id;
  
  const { data, loading: isLoading, error, refetch } = useFetchRentals(userId);
  
  // 3. Forzamos a que 'data' use tu tipo Rental
  const rentals = (data || []) as Rental[];

  const activeRentals = rentals.filter(r => r.status === 'RENTED');
  const historyRentals = rentals.filter(r => r.status === 'RETURNED');

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [category, setCategory] = useState('all');

  const filteredHistory = useMemo(() => {
    return historyRentals.filter((rental) => {
      const item = rental.hardware;
      const price = item?.dailyRate || 0;
      
      const matchesName = (item?.model || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
      const matchesCategory = category === 'all' || item?.category === category;
      
      let matchesPrice = true;
      if (priceRange === 'under25') matchesPrice = price < 25;
      else if (priceRange === '25-50') matchesPrice = price >= 25 && price <= 50;
      else if (priceRange === '50-100') matchesPrice = price >= 50 && price <= 100;
      else if (priceRange === 'over100') matchesPrice = price > 100;

      return matchesName && matchesStatus && matchesCategory && matchesPrice;
    });
  }, [historyRentals, searchTerm, statusFilter, category, priceRange]);

  // 3. FUNCIÓN PARA ANULAR/DEVOLVER ALQUILER (Frontend)
  const handleReturnEquipment = async (rentalId: string) => {
    const confirmReturn = window.confirm("¿Estás seguro de que deseas anular/devolver este equipo?");
    if (!confirmReturn) return;

    try {
      // Aquí llamaremos a la ruta que vamos a crear en el backend
      const response = await fetch(`/api/rentals/${rentalId}/return`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error("Error al procesar la devolución");

      alert("Equipo devuelto con éxito");
      refetch(); // Recargamos los datos para que desaparezca de activos
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al intentar devolver el equipo.");
    }
  };

  if (!userId) {
    return <div className="py-20 text-center text-slate-400 font-medium">Debes iniciar sesión para ver tu historial.</div>;
  }

  return (
    <>
      <BackButton />
      
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        <header>
          <h1 className="text-4xl font-black text-[#1A263C] tracking-tight">
            Mi <span className="text-[#3D70DD]">Actividad</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Gestiona tus alquileres actuales y consulta tu historial.</p>
        </header>

        {/* --- SECCIÓN: ALQUILERES ACTIVOS --- */}
        <section>
          <h2 className="text-[#3D70DD] font-bold uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2BB673] animate-pulse"></span>
            Alquileres en curso ({activeRentals.length})
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {isLoading ? (
               <div className="p-6 text-slate-400 text-sm">Cargando...</div>
            ) : activeRentals.length > 0 ? (
              activeRentals.map((rental) => (
                <div key={rental.id} className="bg-white p-6 rounded-[2rem] border border-blue-50 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F5F8FF] rounded-2xl flex items-center justify-center text-xl">💻</div>
                    <div>
                      <h3 className="font-bold text-[#1A263C]">{rental.hardware?.model || "Equipo"}</h3>
                      <p className="text-xs text-slate-400">
                        Vence el: {new Date(rental.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleReturnEquipment(rental.id)}
                    className="bg-[#1A263C] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-500 transition-colors active:scale-95"
                  >
                    Anular / Devolver
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-slate-50 rounded-[2rem] p-8 text-center border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm font-medium">No tienes alquileres activos en este momento.</p>
              </div>
            )}
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* --- SECCIÓN: HISTORIAL Y FILTROS --- */}
        <section className="space-y-6">
          <h2 className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Historial de alquileres</h2>
          
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex-1">
              <FilterBar 
                category={category} setCategory={setCategory}
                priceRange={priceRange} setPriceRange={setPriceRange}
                status={statusFilter} setStatus={setStatusFilter}
              />
            </div>
            <div className="w-full xl:max-w-md">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1">
                  Búsqueda rápida
                </label>
                <SearchBar onSearch={setSearchTerm} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-blue-100/20 overflow-hidden">
            {isLoading ? (
               <div className="py-24 text-center">Cargando historial...</div>
            ) : filteredHistory.length > 0 ? (
              <RentalTable rentals={filteredHistory} />
            ) : (
              <div className="py-20 text-center space-y-4">
                <span className="text-5xl">🔍</span>
                <p className="text-slate-400 font-medium text-lg">No hay registros en el historial con estos filtros.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  );
}