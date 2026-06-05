import { useRentalStore } from '../../store/rentalStore';
import { Rental } from '../../types';

/**
 * Tests unitarios del store de alquileres.
 * Verifican la gestión de estado y el filtrado por modelo, usuario y estado.
 */

/** Alquileres de ejemplo reutilizados en los tests. */
const SAMPLE: Rental[] = [
  {
    id: 'r1', hardwareId: '1', userId: 'u1',
    startDate: '2026-01-01', endDate: '2026-01-05',
    status: 'RENTED', totalPrice: 200,
    hardware: { model: 'MacBook Pro', dailyRate: 50, category: 'LAPTOP' },
    user: { name: 'Ana', email: 'ana@test.com' },
  },
  {
    id: 'r2', hardwareId: '2', userId: 'u2',
    startDate: '2026-02-01', endDate: '2026-02-03',
    status: 'RETURNED', totalPrice: 50,
    hardware: { model: 'iPad Air', dailyRate: 25, category: 'TABLET' },
    user: { name: 'Luis', email: 'luis@test.com' },
  },
];

describe('rentalStore', () => {
  beforeEach(() => {
    useRentalStore.setState({ items: [], isLoading: false, error: null, searchQuery: '' });
  });

  it('setItems reemplaza la lista de alquileres', () => {
    useRentalStore.getState().setItems(SAMPLE);
    expect(useRentalStore.getState().items).toHaveLength(2);
  });

  it('filteredItems devuelve todos sin búsqueda', () => {
    useRentalStore.getState().setItems(SAMPLE);
    expect(useRentalStore.getState().filteredItems()).toHaveLength(2);
  });

  it('filteredItems filtra por modelo de hardware', () => {
    useRentalStore.getState().setItems(SAMPLE);
    useRentalStore.getState().setSearchQuery('ipad');
    const result = useRentalStore.getState().filteredItems();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('r2');
  });

  it('filteredItems filtra por nombre de usuario', () => {
    useRentalStore.getState().setItems(SAMPLE);
    useRentalStore.getState().setSearchQuery('ana');
    const result = useRentalStore.getState().filteredItems();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('r1');
  });

  it('filteredItems filtra por estado', () => {
    useRentalStore.getState().setItems(SAMPLE);
    useRentalStore.getState().setSearchQuery('returned');
    const result = useRentalStore.getState().filteredItems();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('r2');
  });
});
