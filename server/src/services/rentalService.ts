import { Rental } from '../models/Rental.js';

// Base de datos volátil para Alquileres
const mockRentals: Rental[] = [];

export const getAllRentals = (): Rental[] => {
  return mockRentals;
};

export const getRentalsByUserId = (userId: string): Rental[] => {
  return mockRentals.filter(r => r.userId === userId);
};

export const createRental = (data: Omit<Rental, 'id' | 'status'>): Rental => {
  const newRental: Rental = {
    ...data,
    id: `rent_${Math.random().toString(36).substring(7)}`,
    status: 'pending' // Todo alquiler empieza como pendiente
  };
  mockRentals.push(newRental);
  return newRental;
};