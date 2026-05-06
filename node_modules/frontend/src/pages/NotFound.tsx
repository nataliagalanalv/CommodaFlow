import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-9xl font-black text-slate-200">404</h1>
      <p className="text-2xl font-bold text-slate-800 mt-4">¿Te has perdido?</p>
      <p className="text-slate-500 mt-2 mb-8">No pudimos encontrar la página que buscas.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
      >
        Volver al Inventario
      </Link>
    </div>
  );
};