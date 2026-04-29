import type { Hardware, Rental } from './types'; // Importamos desde el nuevo archivo

const BASE_URL = 'http://localhost:3001/api';

export const api = {
  async getHardware(): Promise<Hardware[]> {
    const response = await fetch(`${BASE_URL}/hardware`);
    if (!response.ok) throw new Error('Error al cargar el inventario');
    return response.json();
  },

  async createRental(rentalData: Rental): Promise<Rental> {
    const response = await fetch(`${BASE_URL}/rentals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rentalData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al procesar el alquiler');
    }
    return response.json();
  }
};