import React from 'react';
import { render, screen } from '@testing-library/react-native';
import InventarioScreen from '../../app/(tabs)/inventario';
import { useHardwareStore } from '../../store/hardwareStore';
import { useAuthStore } from '../../store/authStore';
import { Hardware } from '../../types';

/**
 * Tests de integración de la pantalla de Inventario.
 *
 * Verifican que la UI reacciona correctamente al estado del store:
 * - Store vacío  → muestra el mensaje de "No hay equipos registrados".
 * - Store poblado → muestra las tarjetas de equipos y el contador correcto.
 *
 * `useFocusEffect` se mockea como no-op para que la pantalla NO dispare la
 * petición de red al montarse y podamos controlar el estado del store a mano.
 */
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

const SAMPLE: Hardware[] = [
  { id: '1', model: 'MacBook Pro', specs: 'M3 16GB', category: 'LAPTOP', dailyRate: 50, status: 'AVAILABLE' },
  { id: '2', model: 'iPad Air', specs: 'A14 64GB', category: 'TABLET', dailyRate: 25, status: 'AVAILABLE' },
];

describe('InventarioScreen', () => {
  beforeEach(() => {
    // Usuario autenticado simulado
    useAuthStore.setState({
      user: { id: 'u1', name: 'Ana', email: 'ana@test.com', role: 'USER' },
      token: 'token-abc',
      isAuthenticated: true,
    });
  });

  it('muestra el estado vacío cuando no hay equipos', () => {
    useHardwareStore.setState({ items: [], isLoading: false, error: null, searchQuery: '' });

    render(<InventarioScreen />);

    expect(screen.getByText('No hay equipos registrados')).toBeTruthy();
    expect(screen.getByText('0 equipos')).toBeTruthy();
  });

  it('muestra las tarjetas de equipos cuando el store está poblado', () => {
    useHardwareStore.setState({ items: SAMPLE, isLoading: false, error: null, searchQuery: '' });

    render(<InventarioScreen />);

    expect(screen.getByText('MacBook Pro')).toBeTruthy();
    expect(screen.getByText('iPad Air')).toBeTruthy();
    expect(screen.getByText('2 equipos')).toBeTruthy();
  });
});
