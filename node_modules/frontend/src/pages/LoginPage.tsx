import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

import Logo from '../assets/CommodaFlow_logo.png';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({ email: '', password: ''});
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info('Función de recuperación: Se implementará con el módulo de usuarios.');
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.email.includes('@')) newErrors.email = 'Introduce un email válido';
    if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Por favor, corrige los errores');
      return;
    }

    setIsLoading(true); 

    try {
      // 1. Llamada real a tu servidor
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al acceder');
      }

      login(data.user); 
      
      toast.success(`¡Bienvenido/a de nuevo, ${data.user.name}!`);
      navigate('/');

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado';
          toast.error(errorMessage);
          console.error('Login error:', err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F8FF] p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/60 border border-white p-10">
        
        {/* Logo dentro del cuadrado */}
        <div className="flex justify-center mb-6">
          <img 
            src={Logo} 
            alt="CommodaFlow" 
            className="w-60 h-60 object-contain rounded-2xl" 
          />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-[#1A263C] tracking-tight">Iniciar Sesión</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Por favor, ingresa tus datos para continuar.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Email */}
          <div>
            <label className="block text-xs font-bold text-[#1A263C] uppercase tracking-wider mb-2 ml-1">
              Usuario / Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-4 rounded-2xl border-2 transition-all outline-none text-[#1A263C] ${
                errors.email 
                ? 'border-red-100 bg-red-50' 
                : 'border-[#F5F8FF] bg-[#F5F8FF] focus:border-[#3D70DD] focus:bg-white'
              }`}
              placeholder="nombre@dominio.com"
            />
            {errors.email && <p className="text-red-500 text-[10px] mt-2 ml-2 font-bold">{errors.email}</p>}
          </div>

          {/* Campo Contraseña */}
          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="text-xs font-bold text-[#1A263C] uppercase tracking-wider">Contraseña</label>
              <button 
                onClick={handleForgotPassword}
                className="text-[10px] font-bold text-[#3D70DD] hover:text-[#2F5FC7] transition-colors uppercase tracking-tighter"
              >
                ¿Has olvidado tu contraseña?
              </button>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-4 rounded-2xl border-2 transition-all outline-none text-[#1A263C] ${
                errors.password 
                ? 'border-red-100 bg-red-50' 
                : 'border-[#F5F8FF] bg-[#F5F8FF] focus:border-[#3D70DD] focus:bg-white'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-[10px] mt-2 ml-2 font-bold">{errors.password}</p>}
          </div>

          {/* Botón Acceder */}
          <button
              type="submit"
              disabled={isLoading}
              className="..."
            >
            {isLoading ? 'Verificando...' : 'Acceder'}
          </button>
        </form>

        <footer className="mt-10 pt-6 border-t border-slate-50 text-center">
          <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">
            @CommodaFlow 2026
          </p>
        </footer>
      </div>
    </div>
  );
};