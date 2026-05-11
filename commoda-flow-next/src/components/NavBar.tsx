"use client"; // Obligatorio para usar useAuth y hooks de navegación

import { useAuth } from '../hooks/useAuth';
import { UserAvatar } from './UserAvatar';
import Link from 'next/link'; // Cambio: Link de Next.js
import Image from 'next/image'; 
import { usePathname } from 'next/navigation'; 

const LOGO_ICON = '/assets/CommodaFlow_logo_onlyicon.png';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4">
      
      {/* SECCIÓN IZQUIERDA: LOGO E IDENTIDAD */}
      <div className="flex items-center gap-8">
        {/* Cambiamos el Link para que el logo lleve al Inventario si ya está logueado */}
        <Link href="/inventory" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 flex items-center justify-center">
            <Image 
              src={LOGO_ICON} 
              alt="CommodaFlow Logo" 
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-black tracking-tighter text-[#1A263C]">
            Commoda<span className="text-[#3D70DD]">Flow</span>
          </span>
        </Link>

        {/* LINKS DE NAVEGACIÓN SEGÚN ROL */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-6 border-l border-slate-200 pl-8">
            {user?.role === 'admin' ? (
              <Link 
                href="/inventory" 
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                    pathname === '/inventory' ? 'text-[#3D70DD]' : 'text-[#1A263C] hover:text-[#3D70DD]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${pathname === '/inventory' ? 'bg-[#3D70DD]' : 'bg-slate-300'}`}></span>
                Gestionar Inventario
              </Link>
            ) : (
              <Link 
                href="/dashboard" 
                className={`text-sm font-bold transition-colors ${
                    pathname === '/dashboard' ? 'text-[#3D70DD]' : 'text-slate-500 hover:text-[#3D70DD]'
                }`}
              >
                Mis Alquileres
              </Link>
            )}
          </div>
        )}
      </div>

      {/* SECCIÓN DERECHA: USUARIO Y ACCIONES */}
      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            
            {/* Botón rápido para Admin - Ruta actualizada a /add */}
            {user?.role === 'admin' && (
              <Link 
                href="/add"
                className="hidden lg:flex items-center gap-2 bg-[#1A263C] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-black transition-all shadow-lg shadow-slate-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Equipo
              </Link>
            )}

            <div className="flex items-center gap-4 bg-[#F5F8FF] pl-4 pr-1.5 py-1.5 rounded-2xl border border-blue-50">
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  {user?.role === 'admin' && (
                    <span className="text-[8px] bg-[#3D70DD] text-white px-1.5 py-0.5 rounded font-black uppercase">Admin</span>
                  )}
                  <p className="text-sm font-extrabold text-[#1A263C] leading-tight">
                    {user?.name}
                  </p>
                </div>
                <button 
                  onClick={logout}
                  className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-red-500 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
              <div className="ring-2 ring-white rounded-full shadow-sm">
                <UserAvatar user={user!} size="sm" />
              </div>
            </div>
          </div>
        ) : (
          <Link 
            href="/"
            className="text-sm font-bold text-[#3D70DD] hover:bg-[#3D70DD] hover:text-white px-6 py-3 rounded-xl transition-all duration-300 border border-[#3D70DD]/10 hover:shadow-lg hover:shadow-blue-200"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};