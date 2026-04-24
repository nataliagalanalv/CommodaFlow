import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // Inicializamos el "mando"

 // 1. Estado para los inputs
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // 2. Estado para errores de validación
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiamos el error del campo que se está editando
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.email.includes('@')) newErrors.email = 'Introduce un email válido';
    if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Por favor, corrige los errores');
      return;
    }

    // Si todo va bien, simulamos el login
    login({
      id: '1',
      name: 'Natalia',
      email: formData.email,
      role: 'admin',
      avatarUrl: 'https://ui-avatars.com/api/?name=Natalia'
    });
    
    toast.success('¡Bienvenida de nuevo!');
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Acceso a CommodaFlow</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg border ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
            placeholder="tu@email.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg border ${errors.password ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
            placeholder="••••••"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all transform active:scale-95 shadow-lg shadow-indigo-100"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};