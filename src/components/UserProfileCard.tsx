
"use client";

import React from 'react';
import type { users } from '../types/user.types';

/**
 * Props del componente `UserProfileCard`.
 */
interface UserProfileCardProps {
  /**
   * Datos del usuario a mostrar.
   * Se puede pasar `{ ...user!, name }` para mostrar el nombre editado
   * en tiempo real antes de guardar los cambios.
   */
  user: users;
}

/**
 * Tarjeta de vista previa del perfil de usuario.
 *
 * Muestra el nombre, email y rol del usuario en formato tarjeta.
 * Se usa en la página de perfil como vista previa reactiva que refleja
 * los cambios del formulario en tiempo real (el padre pasa `{ ...user, name }`
 * con el nombre del input local para que el preview sea inmediato).
 *
 * ### Distinción visual por rol
 * - **Administrador**: badge morado con etiqueta "Privilegios Totales".
 * - **Usuario estándar**: badge azul corporativo.
 *
 * @param user - Datos del usuario a mostrar en la tarjeta.
 */
export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {

  const roleValue = user.role?.toLowerCase();
  /** Verdadero si el usuario tiene el rol `admin`. */
  const isAdmin = roleValue === 'admin';

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 flex items-center gap-6 transition-all hover:shadow-2xl hover:shadow-blue-900/10 group">

      <div className="flex-grow">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-black text-[#1A263C] tracking-tight group-hover:text-[#3D70DD] transition-colors">
            {user.name || user.email?.split('@')[0]}
          </h2>
        </div>

        <p className="text-sm font-medium text-slate-400 mb-3">{user.email}</p>

        <div className="flex items-center gap-2">
          <span className={`
            inline-flex items-center px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border shadow-sm
            ${isAdmin
              ? 'bg-[#F0E7FF] text-[#7C3AED] border-[#E2D1FF]'
              : 'bg-[#F5F8FF] text-[#3D70DD] border-[#DBE4FF]'
            }
          `}>
            {isAdmin ? 'Administrador' : 'Usuario'}
          </span>

          {isAdmin && (
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-2">
              Privilegios Totales
            </span>
          )}
        </div>
      </div>

      {/* Detalle decorativo derecho */}
      <div className="hidden sm:block">
        <svg className="w-8 h-8 text-slate-100 group-hover:text-blue-50 transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </div>
    </div>
  );
};
