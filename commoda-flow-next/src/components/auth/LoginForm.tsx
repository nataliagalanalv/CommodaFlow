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
      {/* Campo Email */}
      <div className="space-y-2">
        <label className="block text-[10px] font-black text-[#1A263C] uppercase tracking-[0.2em] ml-1">
          Email corporativo
        </label>
        <input 
          type="email" 
          required
          placeholder="tu@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#F5F8FF] border-2 border-transparent rounded-2xl px-6 py-4 text-[#1A263C] font-bold outline-none focus:border-[#3D70DD]/20 focus:bg-white transition-all placeholder:text-slate-300"
        />
      </div>

      {/* Campo Password */}
      <div className="space-y-2">
        <label className="block text-[10px] font-black text-[#1A263C] uppercase tracking-[0.2em] ml-1">
          Contraseña
        </label>
        <input 
          type="password" 
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#F5F8FF] border-2 border-transparent rounded-2xl px-6 py-4 text-[#1A263C] font-bold outline-none focus:border-[#3D70DD]/20 focus:bg-white transition-all placeholder:text-slate-300"
        />
      </div>

      {/* Botón de Acción */}
      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1A263C] text-white py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-900/10 hover:bg-black transition-all transform active:scale-[0.98] disabled:opacity-50"
      >
        {isSubmitting ? 'Verificando...' : 'Entrar a CommodaFlow'}
      </button>

      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        Acceso restringido a empleados
      </p>
    </form>
  );
};