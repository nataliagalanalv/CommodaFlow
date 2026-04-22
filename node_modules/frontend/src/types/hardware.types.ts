export type HardwareStatus = 'available' | 'rented' | 'maintenance';

export interface Hardware {
  id: string;
  model: string;
  specs: string;
  dailyRate: number;
  status: HardwareStatus;
  image?: string;
}