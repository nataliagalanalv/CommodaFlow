"use client";

import { useAuth } from '../context/AuthContext';
import { InventoryList } from '../components/InventoryList';
import { SearchBar } from '../components/SearchBar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8FF]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#3D70DD]"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto px-8 pt-20 pb-10 space-y-4">

        <div className="flex justify-end">
          <div className="w-full lg:max-w-xl">
            <SearchBar onSearch={setSearchTerm} />
          </div>
        </div>

        <section className="mt-4">
          <header className="px-2 mb-3">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] opacity-60">
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