import { useState } from 'react';
import { toast } from 'sonner';

export interface HardwareFormData {
  model: string;
  type: string;
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

  // Estado para capturar errores de validación
  const [errors, setErrors] = useState<Partial<Record<keyof HardwareFormData, string>>>({});

  // Manejador único para todos los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dailyRate' ? Number(value) : value
    }));

    // Limpiamos el error mientras el usuario escribe
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
      toast.success('Equipo validado y listo para guardar');
    } else {
      toast.error('Corrige los errores del formulario');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Añadir Nuevo Activo</h3>

      {/* Campo Modelo */}
      <div>
        <label className="block text-sm font-semibold text-slate-700">Modelo del equipo</label>
        <input 
          name="model"
          type="text" 
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm transition-colors ${
            errors.model ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500'
          }`}
          value={formData.model}
          onChange={handleChange}
          placeholder="Ej: MacBook Pro M3"
        />
        {errors.model && <p className="mt-1 text-xs text-red-600 font-medium">{errors.model}</p>}
      </div>

      {/* Campo Tipo y Tarifa en una fila */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700">Categoría</label>
          <select 
            name="type"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 sm:text-sm"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="Laptop">Laptop</option>
            <option value="Cámara">Cámara</option>
            <option value="Iluminación">Iluminación</option>
            <option value="Audio">Audio</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Tarifa Diaria (€)</label>
          <input 
            name="dailyRate"
            type="number" 
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.dailyRate ? 'border-red-500' : 'border-slate-300'
            }`}
            value={formData.dailyRate}
            onChange={handleChange}
          />
          {errors.dailyRate && <p className="mt-1 text-xs text-red-600 font-medium">{errors.dailyRate}</p>}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-bold transition-all active:scale-95">
          Guardar Activo
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-white text-slate-700 border border-slate-200 py-2.5 rounded-lg hover:bg-slate-50 font-medium transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
};