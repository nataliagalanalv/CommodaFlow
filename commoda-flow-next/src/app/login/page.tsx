"use client";

import { LoginForm } from '../../components/auth/LoginForm';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Si el usuario ya está logueado, lo mandamos fuera de aquí
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="flex h-screen items-center justify-center">Cargando...</div>;

  return (
    // 'fixed inset-0 z-[100]' para que tape el Nav y cualquier otro elemento
    <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-gray-50 px-4">
      {/* El diseño de tarjeta se maneja DENTRO de LoginForm */}
      <LoginForm />
    </div>
  );
}