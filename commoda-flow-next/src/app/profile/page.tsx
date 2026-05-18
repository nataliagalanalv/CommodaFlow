"use client";

import React from 'react';
import { UserProfileCard } from '../../components/UserProfileCard';
import type { User } from '../../types/user.types';

const MOCK_USER: User = {
  id: 'u1',
  name: 'Natalia Corner',
  email: 'natalia@cornerestudios.com',
  role: 'admin',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Natalia'
};

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      <header className="border-b border-slate-100 pb-8 text-center lg:text-left">
        <h1 className="text-4xl font-black text-[#1A263C] tracking-tight">
          Configuración de <span className="text-[#3D70DD]">Perfil</span>
        </h1>
        <p className="text-slate-500 font-medium mt-2">Actualiza tu información personal y seguridad.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Lado Izquierdo: Card de Vista Previa */}
        <div className="lg:col-span-2">
          <UserProfileCard user={MOCK_USER} />
        </div>

        {/* Lado Derecho: Formulario de Edición */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-8 bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-blue-100/20 space-y-6">
            <h3 className="text-xl font-black text-[#1A263C]">Editar Datos</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-[#3D70DD] uppercase tracking-widest ml-1">Nombre Completo</label>
                <input type="text" defaultValue={MOCK_USER.name} className="w-full mt-1 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[#1A263C]" />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#3D70DD] uppercase tracking-widest ml-1">Nueva Contraseña</label>
                <input type="password" placeholder="••••••••" className="w-full mt-1 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#3D70DD] uppercase tracking-widest ml-1">Seed de Avatar (DiceBear)</label>
                <input type="text" placeholder="Ej: Natalia" className="w-full mt-1 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
            </div>

            <button className="w-full py-4 bg-[#3D70DD] hover:bg-[#1A263C] text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-200 uppercase text-xs tracking-widest">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}