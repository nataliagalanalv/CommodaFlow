'use client';

import './globals.css'
import { useAuth } from '../hooks/useAuth'
import { NavigationMain } from '../components/NavigationMain' 

// Creamos un componente interno para tener acceso al hook useAuth
export function NavWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Mientras la sesión carga, solo mostramos el contenido (evita parpadeos)
  if (isLoading) return <>{children}</>;

  return (
    <>
      {/* 2. SI está autenticado, renderizamos la NAVBAR */}
      {isAuthenticated && <NavigationMain />}
      
      <div className={isAuthenticated ? "pt-2" : ""}>
        {children}
      </div>
    </>
  );
};