"use client";

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Componente de guardia de acceso para rutas exclusivas de administrador.
 *
 * Envuelve cualquier página o sección que solo deba ser visible para usuarios
 * con `role === 'admin'`. Si el usuario no cumple los requisitos, se redirige
 * automáticamente a la página principal (`/`).
 *
 * ### Estrategia de protección
 * 1. **Mientras carga** (`isLoading === true`): muestra un spinner para evitar
 *    un destello de contenido prohibido antes de conocer el rol.
 * 2. **Sin autenticación o sin rol admin**: devuelve `null` mientras el
 *    `useEffect` gestiona la redirección, evitando renderizar el contenido.
 * 3. **Con rol admin confirmado**: renderiza los `children` normalmente.
 *
 * @param children - Contenido protegido que solo se muestra a administradores.
 *
 * @example
 * ```tsx
 * // En una página de solo administrador:
 * return (
 *   <AdminGuard>
 *     <AddHardwarePage />
 *   </AdminGuard>
 * );
 * ```
 */
export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si ya terminó de cargar y no es admin o no está logueado, redirigimos
    if (!isLoading && (!isAuthenticated || user?.role?.toLowerCase() !== 'admin')) {
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
  if (!isAuthenticated || user?.role?.toLowerCase() !== 'admin') {
    return null;
  }

  // Si es admin, mostramos el contenido (lo que antes era el Outlet)
  return <>{children}</>;
};
