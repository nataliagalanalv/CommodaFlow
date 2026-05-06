import { useFetchHardware } from '../hooks/useFetchHardware';

export function InventoryList() {
  // 1. Consumimos el hook
  const { data, loading, error, refetch } = useFetchHardware();

  // 2. Gestión de estado: CARGA
  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <p className="animate-pulse">⏳ Conectando con el servidor...</p>
      </div>
    );
  }

  // 3. Gestión de estado: ERROR
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
        <p className="text-red-600 font-medium">⚠️ Error: {error}</p>
        <button 
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  // 4. Gestión de estado: ÉXITO (DATA)
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inventario de Hardware</h2>
        <button onClick={refetch} className="text-sm text-blue-600 hover:underline">
          Actualizar ahora
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.length === 0 ? (
          <p className="text-gray-500">No hay equipos en el servidor.</p>
        ) : (
          data.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg shadow-sm bg-white">
              <h3 className="text-lg font-semibold">{item.model}</h3>
              <p className="text-gray-600 text-sm mb-2">{item.specs}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  item.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {item.status.toUpperCase()}
                </span>
                <span className="font-mono text-sm">${item.dailyRate}/día</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}