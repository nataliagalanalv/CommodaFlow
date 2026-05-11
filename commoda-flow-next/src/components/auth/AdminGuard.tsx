"use client";

import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si ya terminó de cargar y no es admin o no está logueado, redirigimos
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Mientras carga, mostramos el spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#3D70DD]"></div>
      </div>
    );
  }

  // Si no es admin, no renderizamos nada mientras el useEffect hace la redirección
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  // Si es admin, mostramos el contenido (lo que antes era el Outlet)
  return <>{children}</>;
};