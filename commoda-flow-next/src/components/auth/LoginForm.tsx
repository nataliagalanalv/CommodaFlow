"use client";

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Asegúrate de que la ruta sea correcta
import { toast } from 'sonner';

export const LoginForm: React.FC = () => {
  const { login } = useAuth(); // Usamos tu lógica de autenticación
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Error al entrar');

    
      login(data.user); 

      toast.success('¡Bienvenido de nuevo!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error de credenciales');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 ml-2">
          Correo electrónico
        </label>
        <input 
          type="email" 
          required
          placeholder="nombre@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#F5F8FF] border-2 border-transparent rounded-[1.5rem] px-6 py-4 text-[#1A263C] font-semibold outline-none focus:border-[#3D70DD]/20 focus:bg-white transition-all placeholder:text-slate-300"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 ml-2">
          Contraseña
        </label>
        <input 
          type="password" 
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#F5F8FF] border-2 border-transparent rounded-[1.5rem] px-6 py-4 text-[#1A263C] font-semibold outline-none focus:border-[#3D70DD]/20 focus:bg-white transition-all placeholder:text-slate-300"
        />
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#3D70DD] text-white py-5 rounded-[1.5rem] text-sm font-bold hover:bg-[#2F5FC7] transition-all transform active:scale-[0.98] shadow-lg shadow-blue-100 disabled:opacity-50"
      >
        {isSubmitting ? 'Cargando...' : 'Entrar ahora'}
      </button>

      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        Sistema de inventario educativo
      </p>
    </form>
  );

  }