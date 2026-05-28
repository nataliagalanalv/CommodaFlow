import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { NavWrapper } from '../components/NavWrapper';
import { Toaster } from 'sonner';

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