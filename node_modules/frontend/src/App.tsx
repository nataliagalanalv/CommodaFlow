import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import React from 'react';

import { Navbar } from './components/NavBar';
import { InventoryPage } from './pages/Inventory';
import { NotFoundPage } from './pages/NotFound';
import { LoginPage } from './pages/LoginPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate replace to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="bottom-right" richColors />
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <main className="p-8">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              {/* Rutas Protegidas */}
              <Route path="/" element={
                <PrivateRoute>
                  <InventoryPage />
                </PrivateRoute>
              } />
              
              {/* 404 - Siempre al final */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;