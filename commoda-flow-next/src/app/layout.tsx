import './globals.css';
import { AuthProvider } from '../context/AuthProvider';
import { NavWrapper } from '../components/NavWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#F8FAFC] min-h-screen">
        <AuthProvider>
          <NavWrapper>
            {children}
          </NavWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}