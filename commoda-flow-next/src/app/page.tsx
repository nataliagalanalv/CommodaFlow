"use client";

import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/auth/LoginForm';
import { InventoryList } from '../components/InventoryList';
import { UserProfileCard } from '../components/UserProfileCard';
import { SearchBar } from '../components/SearchBar';
import { useState } from 'react';
import Image from 'next/image';

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8FF]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#3D70DD]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#F5F8FF] flex flex-col items-center justify-center p-6">
        {/* Logo Centralizado con tu Asset */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-24 h-24 mb-6 transition-transform hover:scale-105">
            <Image
              src="/assets/CommodaFlow_logo_onlyicon.png" 
              alt="CommodaFlow Logo"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl font-black text-[#1A263C] tracking-tight">
            Commoda<span className="text-[#3D70DD]">Flow</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Gestión de inventario inteligente</p>
        </div>
        
        <div className="max-w-md w-full">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white/50">
            <LoginForm />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-12">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full md:w-auto">
            <UserProfileCard user={user!} />
          </div>
          <div className="w-full md:max-w-md">
            {/* Aquí capturamos lo que el usuario escribe */}
            <SearchBar onSearch={(val) => setSearchTerm(val)} />
          </div>
        </header>

        <section className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-sm font-black text-[#1A263C] uppercase tracking-[0.3em]">
              Explorar Catálogo
            </h3>
            {user?.role === 'admin' && (
              <button className="bg-[#3D70DD] text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1A263C] transition-all">
                + Añadir Equipo
              </button>
            )}
          </div>

          <div className="bg-[#F5F8FF]/50 p-8 rounded-[3rem] border-2 border-dashed border-slate-100">
            {/* CORRECCIÓN AQUÍ: 
                Le pasamos 'searchTerm' al componente InventoryList.
                Esto quita el error de "variable not used" y activa el filtro.
            */}
            <InventoryList search={searchTerm} />
          </div>
        </section>
      </div>
    </main>
  );
}