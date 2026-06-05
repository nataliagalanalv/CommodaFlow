import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { HardwareCard } from '../../components/items/HardwareCard';
import { Hardware } from '../../types';

/**
 * Tests de integración del componente `HardwareCard`.
 * Verifican que el componente renderiza correctamente los datos del equipo
 * y responde al toque, integrando render real + interacción.
 */

const HW: Hardware = {
  id: '1', model: 'MacBook Pro', specs: 'M3 16GB RAM',
  category: 'LAPTOP', dailyRate: 50, status: 'AVAILABLE',
};

describe('HardwareCard', () => {
  it('muestra el modelo, especificaciones y precio del equipo', () => {
    render(<HardwareCard item={HW} />);

    expect(screen.getByText('MacBook Pro')).toBeTruthy();
    expect(screen.getByText('M3 16GB RAM')).toBeTruthy();
    expect(screen.getByText('50€/día')).toBeTruthy();
  });

  it('muestra el estado traducido a español (Disponible)', () => {
    render(<HardwareCard item={HW} />);
    expect(screen.getByText('Disponible')).toBeTruthy();
  });

  it('muestra "Alquilado" para un equipo RENTED', () => {
    render(<HardwareCard item={{ ...HW, status: 'RENTED' }} />);
    expect(screen.getByText('Alquilado')).toBeTruthy();
  });

  it('invoca onPress al tocar la tarjeta', () => {
    const onPress = jest.fn();
    render(<HardwareCard item={HW} onPress={onPress} />);

    fireEvent.press(screen.getByText('MacBook Pro'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('expone una etiqueta de accesibilidad descriptiva para lectores de pantalla', () => {
    render(<HardwareCard item={HW} />);
    // El label combina modelo, estado y precio en lenguaje natural
    expect(
      screen.getByLabelText('MacBook Pro, Disponible, 50 euros por día')
    ).toBeTruthy();
  });
});
