import './globals.css'
import Link from 'next/link'
import { AuthProvider } from '../context/AuthProvider' 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-[#F8FAFC] min-h-screen">
        {/* 2. Envolvemos todo el contenido */}
        <AuthProvider>
          <nav className="bg-white border-b border-slate-100 py-4 px-8 flex justify-between items-center sticky top-0 z-50">
            <Link href="/inventory" className="text-xl font-black text-[#1A263C]">
              Commoda<span className="text-[#3D70DD]">Flow</span>
            </Link>
            
            <div className="flex gap-6">
              <Link href="/inventory" className="text-sm font-bold text-slate-600 hover:text-[#3D70DD] transition-colors">
                Inventario
              </Link>
              <Link href="/add" className="bg-[#3D70DD] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#2F5FC7] transition-all">
                + Añadir Equipo
              </Link>
            </div>
          </nav>

          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
