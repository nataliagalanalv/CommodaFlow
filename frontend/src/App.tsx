import { Toaster, toast } from 'sonner';
import { Navbar } from './components/NavBar';
import { InventoryPage } from './pages/Inventory';
import type { User } from './types/user.types';
import './App.css'

function App() {
  // Mock de usuario para probar la Navbar
  const mockUser = { name: 'Natalia', role: 'admin', email: 'n@test.com' } as User;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Ponemos el Toaster aquí (solo una vez) */}
      <Toaster position="bottom-right" richColors closeButton />
      
      <Navbar user={mockUser} />
      
      <main className="p-8">
        <InventoryPage />
        
        {/* 2. Un botón de prueba para ver si funciona */}
        <button 
          onClick={() => toast.success('¡Librería instalada con éxito!')}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Probar Toast
        </button>
      </main>
    </div>
  );
}

export default App
