import { Hardware, HardwareStatus } from '../models/Hardware.js';

// Mock data inicial
let inventory: Hardware[] = [
  { id: '1', model: 'MacBook Pro', specs: 'M2, 16GB', status: 'available', dailyRate: 45 },
  { id: '2', model: 'Dell XPS', specs: 'i7, 32GB', status: 'rented', dailyRate: 35 }
];

export const hardwareService = {
  getAll: () => inventory,
  
  getById: (id: string) => inventory.find(h => h.id === id),
  
  // SOLUCIÓN AL ERROR: Añadimos la función 'create'
  create: (data: Omit<Hardware, 'id'>) => {
    const newHardware: Hardware = {
      ...data,
      id: Math.random().toString(36).substr(2, 9), // Generador de ID temporal
      status: data.status || 'available'         // Status por defecto
    };
    inventory.push(newHardware);
    return newHardware;
  },
  
  updateStatus: (id: string, newStatus: HardwareStatus) => {
    const item = inventory.find(h => h.id === id);
    if (item) {
      item.status = newStatus;
      return item;
    }
    return null;
  }
};