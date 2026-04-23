import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import type { Hardware } from '../types/hardware.types';

interface RentalModalProps {
  item: Hardware;
  isOpen: boolean;
  onClose: () => void;
}

export const RentalModal: React.FC<RentalModalProps> = ({ item, isOpen, onClose }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Cálculo del precio total (se actualiza solo cuando cambian las fechas)
  const totalPrice = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays * item.dailyRate : 0;
  }, [startDate, endDate, item.dailyRate]);

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalPrice <= 0) {
      toast.error('La fecha de fin debe ser posterior a la de inicio');
      return;
    }
    
    toast.success(`¡Alquiler de ${item.model} confirmado por ${totalPrice}€!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-1">Confirmar Alquiler</h3>
          <p className="text-sm text-slate-500 mb-6">{item.model}</p>

          <form onSubmit={handleConfirm} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Inicio</label>
                <input 
                  type="date" 
                  required
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fin</label>
                <input 
                  type="date" 
                  required
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mt-4">
              <div className="flex justify-between items-center text-indigo-900 font-semibold">
                <span>Precio Total:</span>
                <span className="text-xl">{totalPrice}€</span>
              </div>
              <p className="text-[10px] text-indigo-400 mt-1 uppercase tracking-wider">Tarifa base: {item.dailyRate}€/día</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
              >
                Confirmar Alquiler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};