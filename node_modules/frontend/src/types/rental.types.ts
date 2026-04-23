import type { User } from './user.types';
import type { Hardware } from './hardware.types';

export type RentalStatus = 'active' | 'returned' | 'overdue' | 'pending';

export interface Rental {
  id: string;
  hardwareId: string;
  userId: string;
  startDate: string; // ISO Date
  endDate: string;   // ISO Date
  status: RentalStatus;
  totalCost: number;
  
  // Opcional: Campos "poblados" para mostrar info sin buscar otra vez
  hardwareDetails?: Pick<Hardware, 'model' | 'dailyRate'>;
  userDetails?: Pick<User, 'name' | 'email'>;
}

// Para cuando creamos un nuevo alquiler
export interface CreateRentalDTO {
  hardwareId: string;
  userId: string;
  startDate: string;
  endDate: string;
}