"use client";

import React, { useState } from 'react';
import { UserProfileCard } from '../../components/UserProfileCard';
import { useAuth } from '../../context/AuthContext';
import type { users } from '../../types/user.types';
import  { BackButton } from '@/components/BackButton';

export default function ProfilePage() {
  const { user, updateUser } = useAuth(); 

  const [name, setName] = useState(user?.name || 'Natalia Corner');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          ...(password && { password }) // Solo envía la password si hay texto
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar');

      const updatedUser = await response.json();
      updateUser(updatedUser);
      alert("¡Cambios guardados con éxito!");
      setPassword(''); 

    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      <BackButton />
      <header className="border-b border-slate-100 pb-8 text-center lg:text-left">
        <h1 className="text-4xl font-black text-[#1A263C] tracking-tight">
          Configuración de <span className="text-[#3D70DD]">Perfil</span>
        </h1>
        <p className="text-slate-500 font-medium mt-2">Actualiza tu información personal y seguridad.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Lado Izquierdo: Card de Vista Previa (Reactiva) */}
        <div className="lg:col-span-5 w-full">
          <UserProfileCard 
            user={{
              ...user!,
              name: name,
            }} 
          />
        </div>

        {/* Lado Derecho: Formulario de Edición */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="p-10 bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-blue-100/20 space-y-8">
            <h3 className="text-2xl font-black text-[#1A263C]">Editar Datos</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-[#3D70DD] uppercase tracking-widest ml-1">Nombre Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[#1A263C]" 
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#3D70DD] uppercase tracking-widest ml-1">Nueva Contraseña</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all" 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#3D70DD] hover:bg-[#1A263C] text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-200 uppercase text-xs tracking-widest disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}