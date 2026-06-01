
"use client";

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import type { Hardware } from '../types/hardware';
import { useAuth } from '../context/AuthContext';

/**
 * Props del modal de confirmación de alquiler (versión web).
 */
interface RentalModalProps {
  /** Verdadero cuando el modal debe mostrarse. */
  isOpen: boolean;
  /** Callback para cerrar el modal sin confirmar. */
  onClose: () => void;
  /** Equipo que se quiere alquilar. */
  item: Hardware;
  /** Callback invocado tras confirmar el alquiler con éxito. Normalmente recarga el inventario. */
  onSuccess: () => void;
}

/**
 * Modal de confirmación de alquiler para la aplicación web.
 *
 * Permite al usuario seleccionar las fechas de inicio y fin del alquiler,
 * muestra el coste total calculado en tiempo real y confirma la operación
 * enviando una petición `POST /api/rentals`.
 *
 * ### Validación de fechas
 * `rentalValidation` (calculado con `useMemo`) comprueba:
 * - Que ambas fechas estén seleccionadas.
 * - Que la fecha de fin no sea anterior al inicio.
 * - Que el alquiler sea de al menos 1 día.
 *
 * El botón de confirmación y el resumen de precio se deshabilitan / apagan
 * visualmente mientras la validación no pase.
 *
 * ### Diseño
 * Overlay con fondo glassmorphism (backdrop-blur). El contenido del modal
 * entra con animación `fade-in zoom-in` de Tailwind.
 *
 * @param isOpen   - Controla la visibilidad del modal.
 * @param onClose  - Función para cerrar el modal.
 * @param item     - Equipo a alquilar.
 * @param onSuccess - Callback tras alquiler exitoso.
 */
export const RentalModal: React.FC<RentalModalProps> = ({ item, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  /** Validación reactiva de las fechas seleccionadas y cálculo de días. */
  const rentalValidation = useMemo(() => {
    if (!startDate || !endDate) {
      return { isValid: false, message: "Selecciona ambas fechas", days: 0 };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalizamos a medianoche para evitar errores con horas/minutos
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { isValid: false, message: "La fecha de fin es anterior al inicio", days: 0 };
    }

    if (diffDays === 0) {
      return { isValid: false, message: "El alquiler mínimo es de 1 día", days: 0 };
    }

    return { isValid: true, message: "", days: diffDays };
  }, [startDate, endDate]);

  /** Precio total calculado como `días × tarifaDiaria`. */
  const totalPrice = rentalValidation.days * item.dailyRate;

  if (!isOpen) return null;

  /**
   * Envía la solicitud de alquiler al servidor.
   * Valida los datos antes de hacer la petición y muestra toasts
   * de éxito o error según el resultado.
   *
   * @param e - Evento del formulario.
   */
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Debes iniciar sesión para alquilar", {
        style: { borderRadius: '1.5rem' }
      });
      return;
    }

    if (!rentalValidation.isValid) {
      toast.warning(rentalValidation.message, {
        style: { borderRadius: '1.5rem' },
        icon: '⚠️'
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
          totalPrice,
          Status: 'RENTED'
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

            {startDate && endDate && !rentalValidation.isValid && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                <span className="text-lg">⚠️</span>
                <p className="text-[11px] font-black text-red-600 uppercase tracking-tight">
                  {rentalValidation.message}
                </p>
              </div>
            )}

            {/* --- CAJA DE RESUMEN DE PRECIO ACTUALIZADA --- */}
            <div className={`p-6 rounded-[2rem] border transition-all duration-300 mt-4 ${
              rentalValidation.isValid
                ? 'bg-[#F5F8FF] border-blue-50 opacity-100'
                : 'bg-slate-50 border-slate-100 opacity-60'
            }`}>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total estimado</span>
                  <span className={`text-3xl font-black tracking-tighter transition-colors ${
                    rentalValidation.isValid ? 'text-[#2BB673]' : 'text-slate-400'
                  }`}>
                    {totalPrice}€
                  </span>
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
