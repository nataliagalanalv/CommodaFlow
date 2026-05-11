import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#F5F8FF] px-4">
      {/* Círculo decorativo de fondo */}
      <div className="absolute w-64 h-64 bg-[#3D70DD]/5 rounded-full blur-3xl -z-10" />
      
      <h1 className="text-[12rem] font-black text-[#1A263C]/5 leading-none select-none">
        404
      </h1>
      
      <div className="mt-[-2rem]">
        <p className="text-3xl font-black text-[#1A263C]">¿Te has perdido?</p>
        <p className="text-slate-500 mt-3 mb-10 max-w-xs mx-auto font-medium">
          Parece que la página que buscas ha sido movida o no existe en el sistema.
        </p>
        
        <Link 
          href="/inventory" 
          className="inline-block px-8 py-4 bg-[#3D70DD] text-white rounded-2xl font-bold hover:bg-[#2F5FC7] hover:scale-105 transition-all shadow-xl shadow-blue-200"
        >
          Volver al Inventario
        </Link>
      </div>

      <footer className="absolute bottom-8">
        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">
          @CommodaFlow 2026
        </p>
      </footer>
    </div>
  );
}