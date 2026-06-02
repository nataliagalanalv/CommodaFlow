"use client";

import React, { useState } from 'react';
import { UserProfileCard } from '../../components/UserProfileCard';
import { useAuth } from '../../context/AuthContext';
import { BackButton } from '@/components/BackButton';
import { toast } from 'sonner';

// ── Iconos SVG inline ─────────────────────────────────────────────────────────

/**
 * Icono de ojo abierto para el toggle de visibilidad de contraseña.
 * Implementado como SVG inline para no añadir dependencias externas.
 */
const EyeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/**
 * Icono de ojo tachado para el toggle de visibilidad de contraseña (estado oculto).
 * Implementado como SVG inline para no añadir dependencias externas.
 */
const EyeOffIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/**
 * Página de perfil de usuario (`/profile`).
 *
 * Permite al usuario autenticado actualizar su nombre y contraseña.
 * Incluye una vista previa reactiva del perfil (`UserProfileCard`) que
 * refleja los cambios del formulario en tiempo real antes de guardar.
 *
 * ### Seguridad de contraseña
 * - La contraseña solo se envía si el usuario ha rellenado el campo.
 * - Se requiere confirmación de contraseña para evitar errores tipográficos.
 * - `pwdMismatch` desactiva el botón de envío y muestra un indicador inline
 *   en cuanto hay discrepancia, antes de llegar al backend.
 * - El servidor hashea la contraseña con bcrypt antes de almacenarla;
 *   el cliente siempre envía texto plano sobre HTTPS.
 *
 * ### Estado local
 * - `name`                → nombre editable del usuario.
 * - `password`            → nueva contraseña (vacío = no cambiar).
 * - `confirmPassword`     → repetición de la nueva contraseña.
 * - `showPassword`        → toggle de visibilidad del campo de nueva contraseña.
 * - `showConfirmPassword` → toggle de visibilidad del campo de confirmación.
 * - `loading`             → verdadero mientras la petición PATCH está en curso.
 */
export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /** Verdadero cuando el campo de confirmación tiene texto y no coincide con `password`. */
  const pwdMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  /**
   * Envía los cambios al servidor vía `PATCH /api/users/[id]`.
   * Valida la coincidencia de contraseñas antes de hacer la petición.
   * Tras guardar correctamente, actualiza el contexto global y limpia
   * los campos de contraseña.
   *
   * @param e - Evento del formulario (necesario para `e.preventDefault()`).
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validación de contraseña
    if (password) {
      if (!confirmPassword) {
        toast.error('Por favor, repite la nueva contraseña');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          // Solo incluye la contraseña si el usuario la ha rellenado
          ...(password && { password }),
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar');

      const updatedUser = await response.json();
      updateUser(updatedUser);
      toast.success('¡Cambios guardados con éxito!');

      // Limpia los campos de contraseña tras guardar
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      <BackButton />

      <header className="border-b border-slate-100 pb-8 text-center lg:text-left">
        <h1 className="text-4xl font-black text-[#1A263C] tracking-tight">
          Configuración de <span className="text-[#3D70DD]">Perfil</span>
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          Actualiza tu información personal y seguridad.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* Vista previa reactiva */}
        <div className="lg:col-span-5 w-full">
          <UserProfileCard user={{ ...user!, name }} />
        </div>

        {/* Formulario de edición */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-10 bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-blue-100/20 space-y-8"
          >
            <h3 className="text-2xl font-black text-[#1A263C]">Editar Datos</h3>

            <div className="space-y-5">

              {/* Nombre */}
              <div>
                <label className="text-[10px] font-black text-[#3D70DD] uppercase tracking-widest ml-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[#1A263C]"
                />
              </div>

              {/* Separador sección contraseña */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Cambio de contraseña <span className="normal-case font-medium">(opcional)</span>
                </p>

                {/* Nueva contraseña */}
                <div className="mb-4">
                  <label className="text-[10px] font-black text-[#3D70DD] uppercase tracking-widest ml-1">
                    Nueva Contraseña
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-5 py-3 pr-12 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label className="text-[10px] font-black text-[#3D70DD] uppercase tracking-widest ml-1">
                    Confirmar Contraseña
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-5 py-3 pr-12 bg-slate-50 border-2 rounded-2xl transition-all focus:ring-2 ${
                        pwdMismatch
                          ? 'border-red-400/70 focus:ring-red-300'
                          : 'border-transparent focus:ring-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {pwdMismatch && (
                    <p className="text-red-500 text-xs font-semibold ml-1 mt-1">
                      Las contraseñas no coinciden
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || pwdMismatch}
              className="w-full py-4 bg-[#3D70DD] hover:bg-[#1A263C] text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-200 uppercase text-xs tracking-widest disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
