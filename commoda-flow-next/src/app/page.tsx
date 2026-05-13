"use client";

import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/auth/LoginForm';
import { InventoryList } from '../components/InventoryList';
import { SearchBar } from '../components/SearchBar';
import { useState } from 'react';
import { Navbar } from '../components/NavBar';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
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
      <div className="max-w-md w-full">
        {/* El contenedor blanco ahora envuelve todo */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white/50">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-white">
      <Navbar /> 

      <div className="max-w-[1600px] mx-auto px-8 pt-20 pb-10 space-y-4">
        
        <div className="flex justify-end">
          <div className="w-full lg:max-w-xl">
            <SearchBar onSearch={setSearchTerm} />
          </div>
        </div>

        <section className="mt-2">
          <header className="px-2">
            <h3 className="text-lg font-gray-700 text-[#1A263C] uppercase tracking-[0.2em]">
              Explorar Catálogo
            </h3>
          </header>

          <div className="bg-[#F5F8FF]/40 p-8 sm:p-12 rounded-[3.5rem] border border-slate-100">
            <InventoryList search={searchTerm} />
          </div>
        </section>
      </div>
    </main>
  );
}