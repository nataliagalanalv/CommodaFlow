"use client";

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import Image from 'next/image';

// ── Iconos SVG inline (sin dependencias externas) ─────────────────────────────

const EyeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const LoginForm: React.FC = () => {
  const { login } = useAuth();

  // ── Login ──────────────────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  // ── Registro ───────────────────────────────────────────────────────────────
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPwd, setShowRegisterPwd] = useState(false);
  const [showRegisterConfirmPwd, setShowRegisterConfirmPwd] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Indicador inline: solo se activa cuando el campo confirmar tiene texto
  const pwdMismatch =
    registerConfirmPassword.length > 0 &&
    registerPassword !== registerConfirmPassword;

  // ── Handlers ───────────────────────────────────────────────────────────────

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
        window.location.href = '/';
      } else {
        throw new Error(data.message || 'Error al autenticar');
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerPassword !== registerConfirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setIsSubmitting(true);
    try {
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const registerData = await registerResponse.json();
      if (!registerResponse.ok) {
        throw new Error(registerData.message || 'Error al registrarse');
      }

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registerEmail, password: registerPassword }),
      });
      const loginData = await loginResponse.json();
      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Error al iniciar sesión');
      }

      toast.success('¡Cuenta creada! Bienvenido');
      login(loginData.user);
      window.location.href = '/';
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-[440px] bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center">

      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 relative">
          <Image
            src="/assets/commodaflow_logo_onlyicon.png"
            alt="CommodaFlow Logo"
            width={80}
            height={80}
            className="object-contain w-full h-full"
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

      {/* Tabs */}
      <div className="w-full flex border-b border-slate-100 mb-8">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 text-center py-3 text-sm font-bold border-b-2 transition-colors ${
            isLogin ? 'text-[#3D70DD] border-[#3D70DD]' : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          Acceso
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 text-center py-3 text-sm font-bold border-b-2 transition-colors ${
            !isLogin ? 'text-[#3D70DD] border-[#3D70DD]' : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          Crear cuenta
        </button>
      </div>

      {isLogin ? (
        /* ── FORMULARIO LOGIN ─────────────────────────────────────────────── */
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
              <label className="text-xs font-bold text-slate-700">Contraseña</label>
              <button type="button" className="text-[11px] font-bold text-[#3D70DD] hover:underline">
                ¿Has olvidado tu contraseña?
              </button>
            </div>
            <div className="relative">
              <input
                type={showLoginPwd ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F5F8FF] border-2 border-transparent rounded-[1.5rem] px-6 py-4 pr-14 text-[#1A263C] font-semibold outline-none focus:border-[#3D70DD]/20 focus:bg-white transition-all placeholder:text-slate-300"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowLoginPwd((v) => !v)}
                aria-label={showLoginPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showLoginPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
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
        /* ── FORMULARIO REGISTRO ──────────────────────────────────────────── */
        <form onSubmit={handleRegisterSubmit} className="w-full space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 ml-2">Nombre completo</label>
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
            <label className="block text-xs font-bold text-slate-700 ml-2">Correo electrónico</label>
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
            <label className="block text-xs font-bold text-slate-700 ml-2">Contraseña</label>
            <div className="relative">
              <input
                type={showRegisterPwd ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full bg-[#F5F8FF] border-2 border-transparent rounded-[1.5rem] px-6 py-4 pr-14 text-[#1A263C] font-semibold outline-none focus:border-[#3D70DD]/20 focus:bg-white transition-all placeholder:text-slate-300"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowRegisterPwd((v) => !v)}
                aria-label={showRegisterPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showRegisterPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 ml-2">Repetir contraseña</label>
            <div className="relative">
              <input
                type={showRegisterConfirmPwd ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                className={`w-full bg-[#F5F8FF] border-2 rounded-[1.5rem] px-6 py-4 pr-14 text-[#1A263C] font-semibold outline-none focus:bg-white transition-all placeholder:text-slate-300 ${
                  pwdMismatch
                    ? 'border-red-400/70 focus:border-red-400'
                    : 'border-transparent focus:border-[#3D70DD]/20'
                }`}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowRegisterConfirmPwd((v) => !v)}
                aria-label={showRegisterConfirmPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showRegisterConfirmPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {pwdMismatch && (
              <p className="text-red-500 text-xs font-semibold ml-2 mt-1">
                Las contraseñas no coinciden
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || pwdMismatch}
            className="w-full bg-[#3D70DD] text-white py-5 rounded-[1.5rem] text-sm font-bold hover:bg-[#2F5FC7] transition-all transform active:scale-[0.98] shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>
      )}
    </div>
  );
};
