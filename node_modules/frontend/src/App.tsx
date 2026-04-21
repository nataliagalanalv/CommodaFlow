
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-blue-500">
        <h1 className="text-3xl font-bold text-gray-800 underline decoration-blue-500">
          ¡Tailwind funcionando! 🚀
        </h1>
        <p className="mt-4 text-gray-600">
          Si ves este texto con estilo, CommodaFlow está listo para el desarrollo.
        </p>
        <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors">
          Probar botón
        </button>
      </div>
    </div>
  )
}

export default App
