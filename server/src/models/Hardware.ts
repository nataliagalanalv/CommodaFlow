// Este es el "contrato" de cómo debe ser un objeto de hardware en tu app
export type HardwareStatus = 'available' | 'rented' | 'maintenance';

export interface Hardware {
  id: string;
  model: string;
  type: string;
  dailyRate: number;
  status: HardwareStatus;
}