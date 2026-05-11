"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import type { HardwareCategory } from '../types/hardware';

export interface HardwareFormData {
  model: string;
  category: HardwareCategory; // Cambiamos 'type' por 'category' para ser consistentes
  dailyRate: number;
  specs: string; // Añadimos specs que lo pide tu inventario
}

interface Props {
  onSubmit: (data: HardwareFormData) => void;
  onCancel: () => void;
}

export const HardwareForm = ({ onSubmit, onCancel }: Props) => {
  const [formData, setFormData] = useState<HardwareFormData>({
    model: '',
    category: 'laptop', 
    dailyRate: 0,
    specs: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof HardwareFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dailyRate' ? Number(value) : value
    }));

    if (errors[name as keyof HardwareFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (formData.model.trim().length < 3) {
      newErrors.model = 'El nombre del modelo es demasiado corto';
    }
    if (formData.dailyRate <= 0) {
      newErrors.dailyRate = 'La tarifa debe ser mayor que 0';
    }
    if (formData.specs.trim().length < 5) {
      newErrors.specs = 'Añade una descripción técnica breve';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    } else {
      toast.error('Corrige los errores del formulario');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5">
      <header className="mb-2">
        <h3 className="text-xl font-black text-[#1A263C]">Nuevo Activo</h3>
        <p className="text-sm text-slate-400 font-medium">Completa los datos técnicos del equipo.</p>
      </header>

      {/* Campo Modelo */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#3D70DD] ml-1">Modelo del equipo</label>
        <input 
          name="model"
          type="text" 
          className={`w-full bg-[#F5F8FF] border-2 rounded-2xl px-6 py-4 text-[#1A263C] font-bold outline-none transition-all ${
            errors.model ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-[#3D70DD]/20'
          }`}
          value={formData.model}
          onChange={handleChange}
          placeholder="Ej: MacBook Pro M3"
        />
        {errors.model && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">{errors.model}</p>}
      </div>

      {/* Especificaciones */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#3D70DD] ml-1">Especificaciones Técnicas</label>
        <textarea 
          name="specs"
          rows={2}
          className={`w-full bg-[#F5F8FF] border-2 rounded-2xl px-6 py-4 text-[#1A263C] font-medium outline-none transition-all resize-none ${
            errors.specs ? 'border-red-200 focus:border-red-400' : 'border-transparent focus:border-[#3D70DD]/20'
          }`}
          value={formData.specs}
          onChange={handleChange}
          placeholder="Ej: 32GB RAM, 1TB SSD, Chip M3 Max"
        />
        {errors.specs && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">{errors.specs}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Categoría */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#3D70DD] ml-1">Categoría</label>
          <select 
            name="category"
            className="w-full bg-[#F5F8FF] border-2 border-transparent rounded-2xl px-6 py-4 text-[#1A263C] font-bold outline-none appearance-none"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="LAPTOP">Laptop</option>
            <option value="TABLET">Tablet</option>
            <option value="PERIPHERAL">Periférico</option>
          </select>
        </div>

        {/* Tarifa */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#3D70DD] ml-1">Tarifa (€/Día)</label>
          <input 
            name="dailyRate"
            type="number" 
            className={`w-full bg-[#F5F8FF] border-2 rounded-2xl px-6 py-4 text-[#1A263C] font-bold outline-none transition-all ${
              errors.dailyRate ? 'border-red-200' : 'border-transparent focus:border-[#3D70DD]/20'
            }`}
            value={formData.dailyRate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button type="submit" className="flex-[2] bg-[#1A263C] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200">
          Guardar Activo
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-white text-slate-400 border border-slate-100 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-xs uppercase tracking-widest">
          Cancelar
        </button>
      </div>
    </form>
  );
};