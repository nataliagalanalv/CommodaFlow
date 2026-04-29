export type HardwareStatus = 'available' | 'rented' | 'maintenance';

export type HardwareCategory = 'laptop' | 'tablet' | 'peripheral';

export interface APIHardware {
  id: string;
  model: string;
  specs: string;
  category: HardwareCategory;
  dailyRate: number;
  status: HardwareStatus;
  image?: string;
}

export interface Hardware extends APIHardware {
  category: HardwareCategory;
}