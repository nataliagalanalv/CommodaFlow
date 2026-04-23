import React from 'react';
import type { Rental } from '../types/rental.types';

export const RentalTable: React.FC<{ rentals: Rental[] }> = ({ rentals }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 bg-white">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Equipo</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Usuario</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Entrega</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rentals.map((rental) => (
            <tr key={rental.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">
                {rental.hardwareDetails?.model || 'Cargando...'}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {rental.userDetails?.name || 'Usuario'}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {new Date(rental.endDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                  rental.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {rental.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};