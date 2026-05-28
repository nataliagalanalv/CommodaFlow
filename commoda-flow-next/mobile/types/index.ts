export type HardwareStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
export type HardwareCategory = 'LAPTOP' | 'TABLET' | 'PERIPHERAL';
export type RentalStatus = 'RENTED' | 'RETURNED' | 'OVERDUE' | 'PENDING' | 'COMPLETED';
export type UserRole = 'USER' | 'ADMIN';

export interface Hardware {
  id: string;
  model: string;
  specs: string;
  category: HardwareCategory;
  dailyRate: number;
  status: HardwareStatus;
  image?: string;
}

export interface Rental {
  id: string;
  hardwareId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: RentalStatus;
  totalCost: number;
  hardware?: {
    model: string;
    dailyRate: number;
    category: string;
  };
  user?: {
    name: string;
    email: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateRentalDTO {
  hardwareId: string;
  userId: string;
  startDate: string;
  endDate: string;
}

// Type guards para distinguir estados en runtime
export function isOverdue(rental: Rental): boolean {
  return rental.status === 'OVERDUE' || new Date(rental.endDate) < new Date();
}

export function isAvailable(hardware: Hardware): boolean {
  return hardware.status === 'AVAILABLE';
}
