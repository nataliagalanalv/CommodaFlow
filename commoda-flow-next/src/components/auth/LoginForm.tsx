"use client";

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Ruta al logo (asegúrate de que el archivo exista en public/assets/)
const LOGO_ICON = '/assets/CommodaFlow_logo_onlyicon.png';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();
  
  // Estados para login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para registro (puedes añadir más campos luego)
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para controlar qué formulario mostrar (Login por defecto)
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || '¡Bienvenido!');
        login(data.user);
        router.push('/'); 
      } else {
        throw new Error(data.message || 'Error al autenticar');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocurrió un error inesperado');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {  // 👈 FALTABA ESTE try {
    const registerResponse = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: registerName, 
        email: registerEmail, 
        password: registerPassword 
      }),
    });

    const registerData = await registerResponse.json();

    if (!registerResponse.ok) {
      throw new Error(registerData.message || 'Error al registrarse');
    }

    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: registerEmail, 
        password: registerPassword,
      }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      throw new Error(loginData.message || 'Error al iniciar sesión');
    }

    toast.success('¡Cuenta creada! Bienvenido');
    login(loginData.user);
    router.push('/');

  } catch (error: unknown) {  // 👈 ahora el catch cierra el try correcto
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Ocurrió un error inesperado');
    }
  } finally {
    setIsSubmitting(false);
  }
};
  


  return (
    // Contenedor principal con diseño de tarjeta
    <div className="w-full max-w-[440px] bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center">
      
      {/* Sección del Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 relative">
          <Image
            src={LOGO_ICON}
            alt="CommodaFlow Logo"
            width={80}
            height={80}
            priority
            className="object-contain"
            // onError={(e) => console.error('Error cargando logo:', e)} // Para debug
          />
        </div>
        <div className="mt-4 text-center">
          <h1 className="text-2xl font-black text-[#1A263C] tracking-tight">
            Commoda<span className="text-[#3D70DD]">Flow</span>
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">
            Gestión de Inventario
          </p>
        </div>
      </div>
      
      {/* Sección de Pestañas (Tabs) */}
      <div className="w-full flex border-b border-slate-100 mb-8">
        <button 
          onClick={() => setIsLogin(true)}
          className={`flex-1 text-center py-3 text-sm font-bold border-b-2 transition-colors ${isLogin ? 'text-[#3D70DD] border-[#3D70DD]' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
        >
          Acceso
        </button>
        <button 
          onClick={() => setIsLogin(false)}
          className={`flex-1 text-center py-3 text-sm font-bold border-b-2 transition-colors ${!isLogin ? 'text-[#3D70DD] border-[#3D70DD]' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
        >
          Crear cuenta
        </button>
      </div>

      {/* Renderizado Condicional del Formulario */}
      {isLogin ? (
        // FORMULARIO DE LOGIN (EXISTENTE)
        <form onSubmit={handleLoginSubmit} className="w-full space-y-6">
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
            <div className="flex justify-between items-center px-2">
              <label className="text-xs font-bold text-slate-700">
                Contraseña
              </label>
              <button 
                type="button" 
                className="text-[11px] font-bold text-[#3D70DD] hover:underline"
              >
                ¿Has olvidado tu contraseña?
              </button>
            </div>
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
            {isSubmitting ? 'Verificando...' : 'Entrar ahora'}
          </button>
        </form>
      ) : (
        // FORMULARIO DE REGISTRO (NUEVO BÁSICO)
        <form onSubmit={handleRegisterSubmit} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 ml-2">
              Nombre completo
            </label>
            <input 
              type="text" 
              required
              placeholder="Juan Pérez"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              className="w-full bg-[#F5F8FF] border-2 border-transparent rounded-[1.5rem] px-6 py-4 text-[#1A263C] font-semibold outline-none focus:border-[#3D70DD]/20 focus:bg-white transition-all placeholder:text-slate-300"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 ml-2">
              Correo electrónico
            </label>
            <input 
              type="email" 
              required
              placeholder="nombre@ejemplo.com"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
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
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              className="w-full bg-[#F5F8FF] border-2 border-transparent rounded-[1.5rem] px-6 py-4 text-[#1A263C] font-semibold outline-none focus:border-[#3D70DD]/20 focus:bg-white transition-all placeholder:text-slate-300"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3D70DD] text-white py-5 rounded-[1.5rem] text-sm font-bold hover:bg-[#2F5FC7] transition-all transform active:scale-[0.98] shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>
      )}

      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-6 mt-6 border-t border-slate-100 w-full">
        Acceso al Panel de Control
      </p>
    </div>
  );
};