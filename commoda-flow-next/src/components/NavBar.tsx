"use client";

import { useAuth } from '../hooks/useAuth';
import { UserAvatar } from './UserAvatar';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const LOGO_ICON = '/assets/CommodaFlow_logo_onlyicon.png';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  // No mostrar Navbar en el login
  if (pathname === '/') return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
        
        {/* SECCIÓN IZQUIERDA: LOGO E IDENTIDAD */}
        <div className="flex items-center gap-10">
          <Link href="/inventory" className="flex items-center gap-3 group">
            <div className="w-11 h-11 flex items-center justify-center transition-transform group-hover:scale-105">
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
                
                {/* Menú Flotante */}
                <div className="absolute top-full left-0 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100">
                  <Link href="/profile" className="block px-5 py-3 text-sm font-bold text-slate-700 hover:bg-[#F5F8FF] hover:text-[#3D70DD]">
                    Editar Usuario
                  </Link>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
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

                {/* Menú Flotante */}
                <div className="absolute top-full left-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100">
                  <Link href="/history" className="block px-5 py-3 text-sm font-bold text-slate-700 hover:bg-[#F5F8FF] hover:text-[#3D70DD]">
                    Mi Historial
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <div className="mt-2 pt-2 border-t border-slate-50">
                      <Link href="/add" className="block px-5 py-3 text-sm font-extrabold text-[#3D70DD] hover:bg-blue-50/50">
                        + Añadir Equipo
                      </Link>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* SECCIÓN DERECHA: AVATAR Y PERFIL */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-4 bg-[#F5F8FF] pl-5 pr-2 py-2 rounded-2xl border border-blue-100/50">
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-2 justify-end">
                  {user?.role === 'admin' && (
                    <span className="text-[9px] bg-[#3D70DD] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                      Admin
                    </span>
                  )}
                  <p className="text-sm font-black text-[#1A263C]">
                    {user?.name}
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  {user?.email}
                </p>
              </div>
              <div className="relative">
                <UserAvatar user={user!} size="sm" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};