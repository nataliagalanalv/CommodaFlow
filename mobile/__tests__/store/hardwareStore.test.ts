import { useHardwareStore } from '../../store/hardwareStore';
import { Hardware } from '../../types';

/**
 * Tests unitarios del store de inventario de hardware.
 *
 * Son rápidos y aislados: no renderizan UI ni tocan la red, solo verifican
 * la lógica de estado y el filtrado local del store de Zustand.
 */

/** Equipos de ejemplo reutilizados en los tests. */
const SAMPLE: Hardware[] = [
  { id: '1', model: 'MacBook Pro', specs: 'M3 16GB', category: 'LAPTOP', dailyRate: 50, status: 'AVAILABLE' },
  { id: '2', model: 'iPad Air', specs: 'A14 64GB', category: 'TABLET', dailyRate: 25, status: 'RENTED' },
  { id: '3', model: 'Logitech MX', specs: 'Ratón inalámbrico', category: 'PERIPHERAL', dailyRate: 5, status: 'AVAILABLE' },
];

describe('hardwareStore', () => {
  // Resetea el store antes de cada test para garantizar aislamiento
  beforeEach(() => {
    useHardwareStore.setState({ items: [], isLoading: false, error: null, searchQuery: '' });
  });

  it('setItems reemplaza la lista completa de equipos', () => {
    useHardwareStore.getState().setItems(SAMPLE);
    expect(useHardwareStore.getState().items).toHaveLength(3);
    expect(useHardwareStore.getState().items[0].model).toBe('MacBook Pro');
  });

  it('setLoading actualiza el indicador de carga', () => {
    useHardwareStore.getState().setLoading(true);
    expect(useHardwareStore.getState().isLoading).toBe(true);
  });

  it('setError establece y limpia el mensaje de error', () => {
    useHardwareStore.getState().setError('Fallo de red');
    expect(useHardwareStore.getState().error).toBe('Fallo de red');
    useHardwareStore.getState().setError(null);
    expect(useHardwareStore.getState().error).toBeNull();
  });

  it('filteredItems devuelve todos los equipos cuando no hay búsqueda', () => {
    useHardwareStore.getState().setItems(SAMPLE);
    expect(useHardwareStore.getState().filteredItems()).toHaveLength(3);
  });

  it('filteredItems filtra por modelo', () => {
    useHardwareStore.getState().setItems(SAMPLE);
    useHardwareStore.getState().setSearchQuery('macbook');
    const result = useHardwareStore.getState().filteredItems();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filteredItems filtra por categoría', () => {
    useHardwareStore.getState().setItems(SAMPLE);
    useHardwareStore.getState().setSearchQuery('tablet');
    const result = useHardwareStore.getState().filteredItems();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filteredItems filtra por especificaciones', () => {
    useHardwareStore.getState().setItems(SAMPLE);
    useHardwareStore.getState().setSearchQuery('inalámbrico');
    const result = useHardwareStore.getState().filteredItems();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('filteredItems es insensible a mayúsculas/minúsculas', () => {
    useHardwareStore.getState().setItems(SAMPLE);
    useHardwareStore.getState().setSearchQuery('IPAD');
    expect(useHardwareStore.getState().filteredItems()).toHaveLength(1);
  });

  it('filteredItems devuelve vacío si nada coincide', () => {
    useHardwareStore.getState().setItems(SAMPLE);
    useHardwareStore.getState().setSearchQuery('xyz123');
    expect(useHardwareStore.getState().filteredItems()).toHaveLength(0);
  });
});
