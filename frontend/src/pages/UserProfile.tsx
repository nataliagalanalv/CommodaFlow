import React from 'react';
import { UserProfileCard } from '../components/UserProfileCard';
import { RentalTable } from '../components/RentalTable';
import type { User } from '../types/user.types';
import type { Rental } from '../types/rental.types';

// Mock de datos para visualizar la página
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

export const UserProfilePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Mi Cuenta</h1>
        <p className="text-slate-500">Gestiona tu información y revisa tus alquileres activos.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna Izquierda: Perfil */}
        <div className="md:col-span-1">
          <UserProfileCard user={MOCK_USER} />
          
          <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <h4 className="text-sm font-bold text-indigo-900 uppercase mb-2">Resumen de Actividad</h4>
            <div className="flex justify-between text-sm">
              <span className="text-indigo-700">Alquileres totales:</span>
              <span className="font-bold text-indigo-900">12</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tabla de Alquileres */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Historial de Alquileres</h3>
          <RentalTable rentals={MOCK_RENTALS} />
        </div>
      </div>
    </div>
  );
};