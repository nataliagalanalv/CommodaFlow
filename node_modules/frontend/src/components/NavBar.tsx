import { useAuth } from '../hooks/useAuth'; // Importa el hook, no el contexto
import { UserAvatar } from './UserAvatar';

export const Navbar = () => {
  // Ahora extraemos todo lo que necesitamos del estado global
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="flex justify-between items-center bg-white border-b border-slate-200 px-8 py-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">C</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          Commoda<span className="text-indigo-600">Flow</span>
        </span>
      </div>

      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <button 
                onClick={logout}
                className="text-xs text-slate-500 hover:text-red-600 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
            <UserAvatar user={user!} size="sm" />
          </div>
        ) : (
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Iniciar Sesión
          </button>
        )}
      </div>
    </nav>
  );
};