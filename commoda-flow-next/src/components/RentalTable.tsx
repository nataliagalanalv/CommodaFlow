"use client";

import React from 'react';
import type { Rental } from '../types/rental.types'; 

interface RentalTableProps {
  rentals: Rental[];
}

export const RentalTable: React.FC<RentalTableProps> = ({ rentals }) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-900/5 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#F5F8FF]">
              <th className="px-8 py-5 text-left text-[10px] font-black text-[#3D70DD] uppercase tracking-[0.2em] border-b border-slate-50">Equipo</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-[#3D70DD] uppercase tracking-[0.2em] border-b border-slate-50">Usuario</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-[#3D70DD] uppercase tracking-[0.2em] border-b border-slate-50">Entrega</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-[#3D70DD] uppercase tracking-[0.2em] border-b border-slate-50">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rentals.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                  No hay registros de alquiler
                </td>
              </tr>
            ) : (
              rentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-[#F5F8FF]/50 transition-colors group">
                  <td className="px-8 py-5 text-sm font-black text-[#1A263C]">
                    {rental.hardwareDetails?.model || 'Equipo desconocido'}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-200" />
                      {rental.userDetails?.name || 'Usuario'}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-400">
                    {new Date(rental.endDate).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${
                      rental.status === 'overdue' 
                        ? 'bg-red-50 text-red-500 border border-red-100' 
                        : 'bg-green-50 text-green-500 border border-green-100'
                    }`}>
                      {rental.status === 'overdue' ? 'Atrasado' : 'Al día'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};