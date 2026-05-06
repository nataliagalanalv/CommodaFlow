import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';

// Componentes y Páginas
import { Navbar } from './components/NavBar';
import { InventoryPage } from './pages/InventoryPage';
import { NotFoundPage } from './pages/NotFound';
import { LoginPage } from './pages/LoginPage';
import { UserDashboard } from './pages/UserDashboard';
import { AddHardware } from './pages/AddHardware';

// 1. Protector de rutas para cualquier usuario logueado
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return null; // Evita parpadeos mientras carga la sesión
  return isAuthenticated ? <>{children}</> : <Navigate replace to="/login" />;
};

// 2. Protector de rutas exclusivo para Administradores
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  // Si no es admin, lo mandamos a la home pública
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate replace to="/" />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      {/* Ocultamos el Navbar si es la página de login */}
      {!isLoginPage && <Navbar />}
      
      <main className={isLoginPage ? "" : "p-8"}>
        <Routes>
          {/* RUTA PÚBLICA / LOGIN */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate replace to="/" /> : <LoginPage />
          } />
          
          {/* RUTAS PRIVADAS (CUSTOMERS & ADMINS) */}
          <Route path="/" element={
            <PrivateRoute>
              <InventoryPage />
            </PrivateRoute>
          } />

          <Route path="/my-rentals" element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          } />

          {/* RUTAS EXCLUSIVAS DE ADMIN */}
          <Route path="/admin/add-hardware" element={
            <AdminRoute>
              <AddHardware />
            </AdminRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="bottom-right" richColors />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;