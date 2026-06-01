"use client";

import { LoginForm } from '../../components/auth/LoginForm';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Página de login/registro (`/login`).
 *
 * Actúa como contenedor a pantalla completa para el componente `LoginForm`,
 * que gestiona internamente los tabs de "Acceso" y "Crear cuenta".
 *
 * ### Redirección automática
 * Si el usuario ya tiene una sesión activa cuando llega a esta URL
 * (p.ej., navegó manualmente), se redirige a `/` para evitar mostrar
 * el formulario de login a alguien que ya está autenticado.
 * El middleware de Next.js hace la misma comprobación en el servidor,
 * pero este `useEffect` cubre el caso del cliente.
 *
 * ### Diseño
 * El contenedor usa `fixed inset-0 z-[100]` para superponerse al `NavWrapper`
 * (que normalmente aparece en todas las páginas) y presentar una experiencia
 * de pantalla completa limpia durante el proceso de autenticación.
 */
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
