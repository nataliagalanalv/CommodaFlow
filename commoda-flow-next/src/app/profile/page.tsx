"use client";

import React from 'react';
import { UserProfileCard } from '../../components/UserProfileCard';
import { RentalTable } from '../../components/RentalTable';
import type { User } from '../../types/user.types';
import type { Rental } from '../../types/rental.types';

// Mock de datos (Mantenemos tus mocks por ahora para la visualización)
const MOCK_USER: User = {
  id: 'u1',
  name: 'Natalia Corner',
  email: 'natalia@cornerestudios.com',
  role: 'admin',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Natalia'
};

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

export default function UserProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      <header className="border-b border-slate-100 pb-8">
        <h1 className="text-4xl font-black text-[#1A263C] tracking-tight">
          Mi <span className="text-[#3D70DD]">Cuenta</span>
        </h1>
        <p className="text-slate-500 font-medium mt-2">Gestiona tu información y revisa tus alquileres activos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Columna Izquierda: Perfil */}
        <div className="lg:col-span-1 space-y-6">
          <UserProfileCard user={MOCK_USER} />
          
          <div className="p-6 bg-[#F5F8FF] rounded-[2rem] border border-blue-50 shadow-sm">
            <h4 className="text-[10px] font-black text-[#3D70DD] uppercase tracking-[0.2em] mb-4">
              Resumen de Actividad
            </h4>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-bold">Alquileres totales:</span>
              <span className="text-2xl font-black text-[#1A263C]">12</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tabla de Alquileres */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#1A263C]">Historial de Alquileres</h3>
            <span className="px-4 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full">
              {MOCK_RENTALS.length} registros
            </span>
          </div>
          
          <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-blue-100/20 overflow-hidden">
            <RentalTable rentals={MOCK_RENTALS} />
          </div>
        </div>
      </div>
    </div>
  );
}