
"use client";

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import type { Hardware } from '../types/hardware';
import { useAuth } from '../hooks/useAuth'; // Asegúrate de tener este hook para acceder al usuario

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Hardware;
  onSuccess: () => void;
}

export const RentalModal: React.FC<RentalModalProps> = ({ item, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Cálculo de precio (mismo que el tuyo, súper limpio)
  const totalPrice = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays * item.dailyRate : 0;
  }, [startDate, endDate, item.dailyRate]);

  if (!isOpen) return null;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Debes iniciar sesión para alquilar", { 
        style: { borderRadius: '1.5rem' } 
      });
      return;
    }

    if (totalPrice <= 0) {
      toast.error("La fecha de fin debe ser posterior a la de inicio", { 
        style: { borderRadius: '1.5rem' } 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Nota: En Next.js apuntamos a la ruta relativa /api/...
      const response = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hardwareId: item.id,
          userId: user.id,
          startDate,
          endDate,
          totalPrice
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
      }

      onSuccess(); 
      toast.success(`¡Reserva confirmada para ${item.model}!`, {
        icon: '✅',
        style: { borderRadius: '1.5rem' }
      });
      onClose();

    } catch (error) {
      console.error("Error al enviar:", error);
      toast.error(error instanceof Error ? error.message : "Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Fondo con desenfoque Glassmorphism */}
      <div 
        className="absolute inset-0 bg-[#1A263C]/40 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Línea decorativa Commodore */}
        <div className="h-2 w-full bg-gradient-to-r from-[#3D70DD] to-[#2BB673]" />

        <div className="p-8 md:p-10">
          <header className="mb-8 flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-black text-[#1A263C] tracking-tight">Confirmar Alquiler</h3>
              <p className="text-slate-400 font-medium text-sm mt-1">{item.model}</p>
            </div>
            <button onClick={onClose} className="text-slate-300 hover:text-[#1A263C] transition-colors p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <form onSubmit={handleConfirm} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-[#1A263C] uppercase tracking-[0.15em] ml-1">Fecha Inicio</label>
                <input 
                  type="date" 
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#F5F8FF] bg-[#F5F8FF] focus:border-[#3D70DD] focus:bg-white transition-all outline-none text-[#1A263C] font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-[#1A263C] uppercase tracking-[0.15em] ml-1">Fecha Fin</label>
                <input 
                  type="date" 
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#F5F8FF] bg-[#F5F8FF] focus:border-[#3D70DD] focus:bg-white transition-all outline-none text-[#1A263C] font-bold text-sm"
                />
              </div>
            </div>

            {/* Caja de Resumen de Precio */}
            <div className="bg-[#F5F8FF] p-6 rounded-[2rem] border border-blue-50 mt-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total estimado</span>
                  <span className="text-3xl font-black text-[#2BB673] tracking-tighter">{totalPrice}€</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#3D70DD] font-black uppercase tracking-wider bg-white px-3 py-1.5 rounded-xl border border-blue-50 shadow-sm">
                    {item.dailyRate}€/día
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-4 text-[11px] uppercase tracking-widest font-black text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-4 bg-[#3D70DD] text-white rounded-2xl text-xs uppercase tracking-[0.2em] font-black shadow-xl shadow-blue-100 hover:bg-[#2F5FC7] transition-all transform active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
              >
                {isSubmitting ? "Procesando..." : "Confirmar Ahora"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};