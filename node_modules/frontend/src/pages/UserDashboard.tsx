import { useAuth } from '../hooks/useAuth';

// 1. Interfaz para el Rental
interface UserRental {
  id: string;
  hardwareName: string;
  date: string;
  status: 'active' | 'returned';
}

// 2. Hook corregido: Usamos 'userId' para que ESLint no se queje
const useUserRentals = (userId?: string) => {
  // Simulamos que usamos el ID para una futura petición al backend
  if (userId) {
    console.log(`Cargando alquileres para el usuario: ${userId}`);
  }

  const rentals: UserRental[] = [
    { id: '1', hardwareName: 'MacBook Pro M2', date: '2023-10-25', status: 'active' },
    { id: '2', hardwareName: 'Logitech MX Master 3', date: '2023-09-10', status: 'returned' },
  ];
  
  return { rentals, loading: false }; 
};

export const UserDashboard = () => {
  const { user } = useAuth();
  const { rentals, loading } = useUserRentals(user?.id);

  // Usamos 'loading' para el feedback visual
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3D70DD]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-[#1A263C] tracking-tight">
          Mi <span className="text-[#3D70DD]">Actividad</span>
        </h1>
        <p className="text-slate-500 font-medium mt-2">Gestiona tus alquileres y consulta tu historial.</p>
      </header>
      
      {/* SECCIÓN: ALQUILERES ACTIVOS */}
      <section className="mb-12">
        <h2 className="text-[#3D70DD] font-bold uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2BB673] animate-pulse"></span>
          Alquileres en curso
        </h2>
        
        <div className="grid gap-4">
          {rentals.filter(r => r.status === 'active').length > 0 ? (
            rentals.filter(r => r.status === 'active').map((rental) => (
              <div key={rental.id} className="bg-white p-6 rounded-[2rem] border border-blue-50 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F5F8FF] rounded-2xl flex items-center justify-center text-xl">💻</div>
                  <div>
                    <h3 className="font-bold text-[#1A263C]">{rental.hardwareName}</h3>
                    <p className="text-xs text-slate-400">Alquilado el {rental.date}</p>
                  </div>
                </div>
                <button className="bg-[#1A263C] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-black transition-colors">
                  Devolver equipo
                </button>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-sm italic px-6">No tienes alquileres activos en este momento.</p>
          )}
        </div>
      </section>

      {/* SECCIÓN: HISTORIAL */}
      <section>
        <h2 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-6">Historial de alquileres</h2>
        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Equipo</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Fecha</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rentals.filter(r => r.status === 'returned').map((rental) => (
                <tr key={rental.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#1A263C] text-sm">{rental.hardwareName}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{rental.date}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-slate-100 text-slate-500 rounded-full">Devuelto</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};