import { useAuth } from '../hooks/useAuth';
import { UserAvatar } from './UserAvatar';
import { Link } from 'react-router-dom'; // Asumiendo que usas react-router para navegar al hacer clic en el logo

import LogoIcon from '../assets/CommodaFlow_logo_onlyicon.png';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4">
      
      {/* SECCIÓN IZQUIERDA: LOGO E IDENTIDAD */}
      <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <div className="w-10 h-10 flex items-center justify-center">
          {/* Tu logo personalizado */}
          <img 
            src={LogoIcon} 
            alt="CommodaFlow Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Nombre con los colores de la página de Login */}
        <span className="text-2xl font-black tracking-tighter text-[#1A263C]">
          Commoda<span className="text-[#3D70DD]">Flow</span>
        </span>
      </Link>

      {/* SECCIÓN DERECHA: USUARIO Y ACCIONES */}
      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <div className="flex items-center gap-4 bg-[#F5F8FF] pl-4 pr-1.5 py-1.5 rounded-2xl border border-blue-50">
            <div className="text-right">
              <p className="text-sm font-extrabold text-[#1A263C] leading-tight">
                {user?.name}
              </p>
              <button 
                onClick={logout}
                className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-red-500 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
            {/* Avatar con borde para resaltar sobre el fondo claro */}
            <div className="ring-2 ring-white rounded-full shadow-sm">
              <UserAvatar user={user!} size="sm" />
            </div>
          </div>
        ) : (
          <Link 
            to="/login"
            className="text-sm font-bold text-[#3D70DD] hover:bg-[#3D70DD] hover:text-white px-6 py-3 rounded-xl transition-all duration-300 border border-transparent hover:shadow-lg hover:shadow-blue-200"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};