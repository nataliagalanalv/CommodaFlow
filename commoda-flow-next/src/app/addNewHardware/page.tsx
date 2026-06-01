'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminGuard } from '../../components/auth/AdminGuard'
import type { HardwareCategory } from '../../types/hardware';
import { BackButton } from '@/components/BackButton';

/** Opciones de categoría disponibles para el formulario. */
const CATEGORIES = [
  { value: 'LAPTOP', label: 'Portátil' },
  { value: 'TABLET', label: 'Tablet' },
  { value: 'PERIPHERAL', label: 'Periférico' },
];

/**
 * Página para añadir un nuevo equipo al inventario (`/addNewHardware`).
 *
 * Exclusiva para administradores: el componente `AdminGuard` redirige a `/`
 * si el usuario no tiene el rol `ADMIN`, tanto desde la UI como desde el servidor.
 *
 * ### Flujo
 * 1. El administrador rellena el formulario (modelo, categoría, tarifa, specs).
 * 2. Al enviar, se llama a `POST /api/hardware` con los datos validados.
 * 3. Si tiene éxito, se redirige al inventario (`/`) y se refresca la página
 *    para que Next.js invalide el caché y muestre el nuevo equipo.
 *
 * ### Estado local
 * - `formData` → objeto con los campos del formulario (modelo, specs, categoría, tarifa).
 * - `loading`  → verdadero mientras la petición POST está en curso.
 */
export default function AddHardwarePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    model: '',
    specs: '',
    category: 'LAPTOP' as HardwareCategory,
    dailyRate: '',
  });

  /**
   * Maneja el envío del formulario.
   * Convierte `dailyRate` de string a número antes de enviarlo al backend,
   * ya que los inputs HTML de tipo `number` devuelven strings.
   *
   * @param e - Evento del formulario.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const hardwareToSave = {
      model: formData.model,
      specs: formData.specs,
      category: formData.category,
      dailyRate: Number(formData.dailyRate),
    };

    try {
      const response = await fetch('/api/hardware', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hardwareToSave),
      });

      if (!response.ok) {
        throw new Error('Error al guardar en el servidor');
      }

      console.log('✅ Hardware guardado con éxito en Neon');

      router.push('/');
      router.refresh();

    } catch (error) {
      console.error('❌ Error:', error);
      alert('No se pudo guardar el equipo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <BackButton />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-[#1A263C] tracking-tight">
            Añadir <span className="text-[#3D70DD]">Nuevo Equipo</span>
          </h1>
        <p className="text-slate-500 mt-2">Introduce los detalles técnicos para el catálogo.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-100/50 border border-slate-50">
        <div className="grid gap-6">

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Modelo del Equipo</label>
            <input
              required
              type="text"
              placeholder="Ej: MacBook Pro M3 14\""
              className="w-full bg-[#F5F8FF] border-none rounded-2xl px-6 py-4 text-[#1A263C] font-bold focus:ring-2 focus:ring-[#3D70DD] transition-all outline-none"
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Categoría</label>
              <select
                className="w-full bg-[#F5F8FF] border-none rounded-2xl px-6 py-4 text-[#1A263C] font-bold focus:ring-2 focus:ring-[#3D70DD] transition-all appearance-none outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as HardwareCategory})}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Tarifa (€/día)</label>
              <input
                required
                type="number"
                placeholder="0.00"
                className="w-full bg-[#F5F8FF] border-none rounded-2xl px-6 py-4 text-[#1A263C] font-bold focus:ring-2 focus:ring-[#3D70DD] transition-all outline-none"
                value={formData.dailyRate}
                onChange={(e) => setFormData({...formData, dailyRate: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Especificaciones Clave</label>
            <textarea
              required
              rows={3}
              placeholder="Ej: 32GB RAM, 1TB SSD, Chip M3 Pro..."
              className="w-full bg-[#F5F8FF] border-none rounded-2xl px-6 py-4 text-[#1A263C] font-bold focus:ring-2 focus:ring-[#3D70DD] transition-all resize-none outline-none"
              value={formData.specs}
              onChange={(e) => setFormData({...formData, specs: e.target.value})}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-[#1A263C] text-white px-6 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Publicar en Inventario'
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
    </AdminGuard>
  );
}
