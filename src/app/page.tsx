"use client";

import { useAuth } from '../context/AuthContext';
import { InventoryList } from '../components/InventoryList';
import { SearchBar } from '../components/SearchBar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FilterBar } from '@/components/FilterBar';

/**
 * Página principal (`/`) — Inventario de hardware.
 *
 * Es la vista central de CommodaFlow: muestra el catálogo completo de equipos
 * con filtros por categoría, estado y precio, más una barra de búsqueda de texto libre.
 *
 * ### Protección de ruta
 * Aunque el middleware de Next.js ya redirige usuarios no autenticados a `/login`,
 * este componente añade una segunda comprobación con `useEffect` para cubrir
 * el caso de que el estado de sesión se pierda en el cliente sin recarga.
 *
 * ### Estado local
 * - `searchTerm`  → texto escrito en el `SearchBar`, pasado a `InventoryList`.
 * - `category`    → filtro de categoría (`all` | `LAPTOP` | `TABLET` | `PERIPHERAL`).
 * - `priceRange`  → franja de precio diario (`all` | `under25` | `25-50` | `50-100` | `over100`).
 * - `status`      → filtro de disponibilidad (`all` | `available` | `rented`).
 */
export default function HomePage() {
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    if (!isLoading && user === null) {
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
      <div className="max-w-[1600px] mx-auto px-8 pt-4 pb-10 space-y-6">

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <FilterBar
            category={category} setCategory={setCategory}
            priceRange={priceRange} setPriceRange={setPriceRange}
            status={status} setStatus={setStatus}
          />
          <div className="w-full lg:max-w-md">
            <SearchBar onSearch={setSearchTerm} />
          </div>
        </div>

        <section className="mt-4">
          {/* Pasa los nuevos filtros como props a InventoryList */}
          <div className="bg-[#F5F8FF]/40 p-8 sm:p-12 rounded-[3.5rem] border border-slate-100">
            <InventoryList
              search={searchTerm}
              category={category}
              priceRange={priceRange}
              status={status}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
