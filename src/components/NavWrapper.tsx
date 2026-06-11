"use client";

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

/** Ruta del logo como icono sin texto, para mayor limpieza en la barra de nav. */
const LOGO_ICON = '/assets/commodaflow_logo_onlyicon.png';

/**
 * Barra de navegación principal de la aplicación web.
 *
 * Componente de cliente fijado en la parte superior de la pantalla (`fixed top-0`).
 * Se adapta al estado de sesión: si el usuario está autenticado muestra los menús
 * desplegables y la cápsula de perfil; de lo contrario, solo muestra el logo.
 *
 * ### Menús desplegables (hover)
 * - **Usuario** → "Editar Usuario" (→ `/profile`) | "Cerrar Sesión".
 * - **Inventario** → "Mi Historial" (→ `/record`) | "+ Añadir Equipo" (→ `/addNewHardware`,
 *   solo visible para administradores).
 *
 * ### Cápsula de perfil (derecha)
 * Muestra el nombre del usuario y su rol, enlazando a `/profile`. La etiqueta
 * de rol se normaliza a "Administrador" o "Usuario" independientemente de la
 * casing que devuelva la base de datos.
 *
 * ### Sincronización de sesión
 * Al montar, llama a `refreshUser()` para sincronizar el contexto con la
 * cookie de sesión actual, cubriendo el caso de múltiples pestañas abiertas.
 */
export const NavWrapper = () => {
  const { user, logout, isAuthenticated, refreshUser } = useAuth();

  /** Nombre a mostrar: nombre real del usuario, o la parte local del email como fallback. */
  const displayName = user?.name || user?.email?.split('@')[0] || 'Usuario';

  /** Etiqueta de rol normalizada para mostrar en la UI. */
  const displayRole = user?.role?.toLowerCase() === 'admin' ? 'Administrador' : 'Usuario';

  // Refresca el usuario una sola vez al montar la barra de navegación.
  // `refreshUser` se omite a propósito de las dependencias: incluirlo provocaría
  // re-ejecuciones innecesarias, ya que la función no está memoizada en el contexto.
  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">

        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 flex items-center justify-center">
              <Image
                src={LOGO_ICON}
                alt="CommodaFlow Logo"
                width={44}
                height={44}
                className="object-contain"
              />
            </div>
            <span className="text-3xl font-black tracking-tighter text-[#1A263C]">
              Commoda<span className="text-[#3D70DD]">Flow</span>
            </span>
          </Link>

          {/* MENÚS DESPLEGABLES (HOVER) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-2">

              {/* Dropdown: USUARIO */}
              <div className="group relative px-4 py-2">
                <button className="flex items-center gap-2 text-[13px] font-black text-slate-500 uppercase tracking-widest group-hover:text-[#3D70DD] transition-colors">
                  Usuario
                  <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="absolute top-full left-0 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100">
                  <Link href="/profile" className="block px-5 py-3 text-sm font-bold text-slate-700 hover:bg-[#F5F8FF] hover:text-[#3D70DD]">
                    Editar Usuario
                  </Link>
                  <button
                      onClick={logout}
                      className="w-full text-left px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                            Cerrar Sesión
                    </button>
                </div>
              </div>

              {/* Dropdown: INVENTARIO */}
              <div className="group relative px-4 py-2">
                <button className="flex items-center gap-2 text-[13px] font-black text-slate-500 uppercase tracking-widest group-hover:text-[#3D70DD] transition-colors">
                  Inventario
                  <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="absolute top-full left-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100">
                  <Link href="/record" className="block px-5 py-3 text-sm font-bold text-slate-700 hover:bg-[#F5F8FF] hover:text-[#3D70DD]">
                    Mi Historial
                  </Link>

                  {user?.role?.toLowerCase() === 'admin' && (
                    <div className="mt-2 pt-2 border-t border-slate-50">
                      <Link href="/addNewHardware" className="block px-5 py-3 text-sm font-bold text-slate-700 hover:bg-[#F5F8FF] hover:text-[#3D70DD]">
                        + Añadir Equipo
                      </Link>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* SECCIÓN DERECHA: CAPSULA DE PERFIL */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Link
              href="/profile"
              className="flex flex-col items-end justify-center bg-[#F5F8FF] px-6 py-2.5 rounded-2xl border border-blue-100/50 hover:bg-[#EEF4FF] hover:border-[#3D70DD]/30 transition-all group"
            >
              <p className="text-sm font-black text-[#1A263C] group-hover:text-[#3D70DD] transition-colors leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                {displayRole}
              </p>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
