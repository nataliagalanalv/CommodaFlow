import { Hardware } from '../models/Hardware.js';

// Base de datos volátil (se borra al reiniciar el servidor)
const mockHardware: Hardware[] = [
  { id: '1', model: 'MacBook Pro M3', type: 'Laptop', dailyRate: 45, status: 'available' },
  { id: '2', model: 'Sony A7 IV', type: 'Cámara', dailyRate: 60, status: 'rented' }
];

export const getAllHardware = () => mockHardware;

export const createHardware = (data: Omit<Hardware, 'id' | 'status'>): Hardware => {
  const newItem: Hardware = {
    ...data,
    id: Math.random().toString(36).substring(7),
    status: 'available'
  };
  mockHardware.push(newItem);
  return newItem;
};