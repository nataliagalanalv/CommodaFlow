import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { HardwareCategory } from '../types/hardware.types';

// Opciones para el selector de categoría
const CATEGORIES: { value: HardwareCategory; label: string }[] = [
  { value: 'laptop', label: 'Portátil' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'peripheral', label: 'Periférico' },
];

export const AddHardware = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    model: '',
    specs: '',
    category: 'laptop' as HardwareCategory,
    dailyRate: '',
    serialNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Aquí irá la llamada al backend más adelante
    console.log('Enviando datos:', formData);
    
    // Simulación de éxito
    setTimeout(() => {
      setLoading(false);
      navigate('/'); // Volver al inventario tras añadir
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black text-[#1A263C] tracking-tight">
          Añadir <span className="text-[#3D70DD]">Nuevo Equipo</span>
        </h1>
        <p className="text-slate-500 mt-2">Introduce los detalles técnicos para el catálogo.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-100/50 border border-slate-50">
        <div className="grid gap-6">
          
          {/* Modelo */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Modelo del Equipo</label>
            <input 
              required
              type="text"
              placeholder="Ej: MacBook Pro M3 14\"
              className="w-full bg-[#F5F8FF] border-none rounded-2xl px-6 py-4 text-[#1A263C] font-bold focus:ring-2 focus:ring-[#3D70DD] transition-all"
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
            />
          </div>

          {/* Categoría y Tarifa */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Categoría</label>
              <select 
                className="w-full bg-[#F5F8FF] border-none rounded-2xl px-6 py-4 text-[#1A263C] font-bold focus:ring-2 focus:ring-[#3D70DD] transition-all appearance-none"
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
                className="w-full bg-[#F5F8FF] border-none rounded-2xl px-6 py-4 text-[#1A263C] font-bold focus:ring-2 focus:ring-[#3D70DD] transition-all"
                value={formData.dailyRate}
                onChange={(e) => setFormData({...formData, dailyRate: e.target.value})}
              />
            </div>
          </div>

          {/* Especificaciones */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Especificaciones Clave</label>
            <textarea 
              required
              rows={3}
              placeholder="Ej: 32GB RAM, 1TB SSD, Chip M3 Pro..."
              className="w-full bg-[#F5F8FF] border-none rounded-2xl px-6 py-4 text-[#1A263C] font-bold focus:ring-2 focus:ring-[#3D70DD] transition-all resize-none"
              value={formData.specs}
              onChange={(e) => setFormData({...formData, specs: e.target.value})}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => navigate(-1)}
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
  );
};