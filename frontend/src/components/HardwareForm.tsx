import { useState } from 'react';
// import type { HardwareStatus } from '../types/hardware.types';

// El contrato del formulario: campos que el usuario DEBE llenar
export interface HardwareFormData {
  model: string;
  type: string; // O podrías usar un tipo más específico aquí
  dailyRate: number;
}

interface Props {
  onSubmit: (data: HardwareFormData) => void;
  onCancel: () => void;
}

export const HardwareForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<HardwareFormData>({
    model: '',
    type: 'Laptop',
    dailyRate: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
      <div>
        <label className="block text-sm font-medium text-slate-700">Modelo del equipo</label>
        <input 
          type="text" 
          required
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.model}
          onChange={e => setFormData({...formData, model: e.target.value})}
        />
      </div>
      <div className="flex gap-4">
        <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 font-medium">
          Guardar Activo
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-white text-slate-700 border border-slate-300 py-2 rounded-md hover:bg-slate-50 font-medium">
          Cancelar
        </button>
      </div>
    </form>
  );
};