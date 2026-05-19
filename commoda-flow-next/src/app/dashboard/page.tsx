"use client";

import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { RentalTable } from '../../components/RentalTable'; 
import type { Rental } from '../../types/rental.types';

const useUserRentals = (userId?: string) => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/rentals?userId=${userId}`);
        
        if (!response.ok) throw new Error("Error al obtener los alquileres");
        
        const data = await response.json();
        setRentals(data);
      } catch (error) {
        console.error("Error cargando alquileres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [userId]);
  
  return { rentals, loading }; 
};

export default function UserDashboard() {
  const { user } = useAuth();
  const { rentals, loading } = useUserRentals(user?.id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3D70DD]"></div>
      </div>
    );
  }

  // Separamos los alquileres activos de los devueltos/historial
  // Ajusta "active" o "returned" según cómo los llames en tu base de datos
  const activeRentals = rentals.filter(r => r.status === 'active' || r.status === 'overdue');
  const historyRentals = rentals.filter(r => r.status === 'returned' || r.status === 'completed');

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-[#1A263C] tracking-tight">
          Mi <span className="text-[#3D70DD]">Actividad</span>
        </h1>
        <p className="text-slate-500 font-medium mt-2">Gestiona tus alquileres y consulta tu historial.</p>
      </header>
      
      {/* SECCIÓN: ALQUILERES ACTIVOS */}
      <section className="mb-12">
        <h2 className="text-[#3D70DD] font-bold uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2BB673] animate-pulse"></span>
          Alquileres en curso
        </h2>
        
        <div className="grid gap-4">
          {activeRentals.length > 0 ? (
            activeRentals.map((rental) => (
              <div key={rental.id} className="bg-white p-6 rounded-[2rem] border border-blue-50 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F5F8FF] rounded-2xl flex items-center justify-center text-xl">💻</div>
                  <div>
                    {/* Usamos hardwareDetails porque es lo que viene de Prisma (con el include) */}
                    <h3 className="font-bold text-[#1A263C]">{rental.hardwareDetails?.model || "Equipo"}</h3>
                    <p className="text-xs text-slate-400">
                      Vence el: {new Date(rental.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="bg-[#1A263C] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-black transition-colors">
                  Devolver equipo
                </button>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-sm italic px-6">No tienes alquileres activos en este momento.</p>
          )}
        </div>
      </section>

      {/* SECCIÓN: HISTORIAL CON TU RENTALTABLE */}
      <section>
        <h2 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-6">Historial de alquileres</h2>
        {/* Aquí insertamos tu tabla y le pasamos solo los alquileres pasados */}
        <RentalTable rentals={historyRentals} />
      </section>
    </div>
  );
}