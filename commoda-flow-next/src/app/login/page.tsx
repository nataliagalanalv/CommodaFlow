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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">CommodaFlow</h1>
        <LoginForm />
        {/* Aquí es donde luego añadiremos el botón de "Crear cuenta" */}
      </div>
    </div>
  );
}