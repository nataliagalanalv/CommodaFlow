import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { NavWrapper } from '../components/NavWrapper';
import { Toaster } from 'sonner';

/**
 * Layout raíz de la aplicación web CommodaFlow.
 *
 * Define la estructura HTML compartida por todas las páginas:
 * - `AuthProvider` envuelve todo el árbol para que cualquier componente
 *   pueda acceder al estado de sesión vía `useAuth()`.
 * - `NavWrapper` es la barra de navegación fija; se renderiza antes del
 *   contenido principal y tiene `z-index` alto para superponerse a todo.
 * - `<main>` aplica `pt-32` para dejar espacio a la barra de nav (h-20)
 *   más margen de respiro visual.
 * - `<Toaster>` de Sonner debe estar fuera de las páginas para que las
 *   notificaciones se muestren siempre, independientemente de la ruta activa.
 *
 * @param children - Contenido de la página activa renderizado por Next.js.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <AuthProvider>
          <NavWrapper />
          <main className="pt-32 pb-12"> {/* pt-32 da aire suficiente para tu Nav de h-20 */}
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
