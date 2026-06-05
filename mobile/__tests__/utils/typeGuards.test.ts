import { isOverdue, isAvailable } from '../../types';
import { Hardware, Rental } from '../../types';

/**
 * Tests unitarios de los type guards puros de `types/index.ts`.
 * Son funciones sin efectos secundarios → ideales para tests rápidos.
 */

describe('isAvailable', () => {
  it('devuelve true para hardware AVAILABLE', () => {
    const hw: Hardware = { id: '1', model: 'X', specs: 'Y', category: 'LAPTOP', dailyRate: 10, status: 'AVAILABLE' };
    expect(isAvailable(hw)).toBe(true);
  });

  it('devuelve false para hardware RENTED', () => {
    const hw: Hardware = { id: '1', model: 'X', specs: 'Y', category: 'LAPTOP', dailyRate: 10, status: 'RENTED' };
    expect(isAvailable(hw)).toBe(false);
  });

  it('devuelve false para hardware MAINTENANCE', () => {
    const hw: Hardware = { id: '1', model: 'X', specs: 'Y', category: 'LAPTOP', dailyRate: 10, status: 'MAINTENANCE' };
    expect(isAvailable(hw)).toBe(false);
  });
});

describe('isOverdue', () => {
  /** Construye un alquiler mínimo con la fecha de fin y estado indicados. */
  function makeRental(endDate: string, status: Rental['status']): Rental {
    return { id: 'r', hardwareId: 'h', userId: 'u', startDate: '2026-01-01', endDate, status, totalPrice: 10 };
  }

  it('devuelve true si el estado es OVERDUE explícitamente', () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    expect(isOverdue(makeRental(future, 'OVERDUE'))).toBe(true);
  });

  it('devuelve true si la fecha de fin ya pasó', () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    expect(isOverdue(makeRental(past, 'RENTED'))).toBe(true);
  });

  it('devuelve false si la fecha de fin es futura y no está OVERDUE', () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    expect(isOverdue(makeRental(future, 'RENTED'))).toBe(false);
  });
});
