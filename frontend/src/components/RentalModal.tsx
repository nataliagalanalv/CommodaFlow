import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import type { Hardware } from '../types/hardware.types';
import { useAuth } from '../hooks/useAuth';

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Hardware;
  onSuccess: () => void; // <--- Añade esta línea obligatoria
}

  export const RentalModal: React.FC<RentalModalProps> = ({ item, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
      toast.error("Debes iniciar sesión para alquilar");
      return;
    }

    if (totalPrice <= 0) {
      toast.error("La fecha de fin debe ser posterior a la de inicio");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/api/rentals', {
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

      // 2. ¡EL MOMENTO CLAVE!
      // Llamamos a la función que refresca el inventario
      onSuccess(); 
      
      toast.success(`¡Reserva confirmada!`);
      onClose();

    } catch (error) {
      console.error("Error al enviar:", error);
      toast.error(error instanceof Error ? error.message : "Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
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
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fin</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mt-4">
              <div className="flex justify-between items-center text-indigo-900 font-semibold">
                <span>Precio Total:</span>
                <span className="text-xl">{totalPrice}€</span>
              </div>
              <p className="text-[10px] text-indigo-400 mt-1 uppercase tracking-wider"> Tarifa: {item.dailyRate}€/día</p>
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
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
              >
                {isSubmitting ? "Procesando..." : "Confirmar Alquiler"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};