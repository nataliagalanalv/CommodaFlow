import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Mientras verificamos la sesión, no mostramos nada o un spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#3D70DD]"></div>
      </div>
    );
  }

  // Si no está autenticado o no es admin, fuera
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si es admin, dejamos que pase a las rutas hijas (Outlet)
  return <Outlet />;
};