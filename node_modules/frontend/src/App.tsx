import { Toaster } from 'sonner'; // <-- ¡Sigue siendo necesario!
import { AuthProvider } from './context/AuthProvider';
import { Navbar } from './components/NavBar';
import { InventoryPage } from './pages/Inventory';

function App() {
  return (
    <AuthProvider>
      {/* El Toaster puede ir aquí arriba o abajo, 
          mientras esté dentro del componente principal */}
      <Toaster position="bottom-right" richColors closeButton />
      
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="p-8">
          <InventoryPage />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;