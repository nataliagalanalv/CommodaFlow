import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';


import { Navbar } from './components/NavBar';
import { InventoryPage } from './pages/InventoryPage';
import { NotFoundPage } from './pages/NotFound';
import { LoginPage } from './pages/LoginPage';


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate replace to="/login" />;
};


const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      {/* Ocultamos el Navbar si es la página de login */}
      {!isLoginPage && <Navbar />}
      
      {/* Si es login, quitamos el padding (p-8) para que el diseño centrado 
         que hicimos en la LoginPage luzca perfecto 
      */}
      <main className={isLoginPage ? "" : "p-8"}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <InventoryPage />
            </PrivateRoute>
          } />
          
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