import { type Hardware } from '../types/hardware.types';

export const mockHardware: Hardware[] = [
  {
    id: 'h1',
    model: 'MacBook Pro M3 Max',
    specs: '64GB RAM, 2TB SSD, GPU 40-core',
    dailyRate: 45,
    status: 'available'
  },
  {
    id: 'h2',
    model: 'Nvidia RTX 4090 FE',
    specs: '24GB GDDR6X, DLSS 3.5',
    dailyRate: 20,
    status: 'rented'
  },
  {
    id: 'h3',
    model: 'Sony A7 IV',
    specs: '33MP Full-Frame, 4K 60p',
    dailyRate: 35,
    status: 'available'
  },
  {
    id: 'h4',
    model: 'iPad Pro 12.9"',
    specs: 'M2 Chip, 512GB, Liquid Retina XDR',
    dailyRate: 15,
    status: 'maintenance'
  }
];