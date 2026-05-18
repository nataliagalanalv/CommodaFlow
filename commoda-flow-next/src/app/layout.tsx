import './globals.css';
import { AuthProvider } from '../context/AuthProvider';
import { NavWrapper } from '../components/NavWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#F8FAFC] min-h-screen">
        <AuthProvider>
          <NavWrapper /> 
          <main className="pt-32 px-4 md:px-8 max-w-7xl mx-auto">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}