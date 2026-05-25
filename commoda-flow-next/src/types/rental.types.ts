export type RentalStatus = 'RENTED' | 'RETURNED' | 'OVERDUE' | 'PENDING' | 'COMPLETED';

export interface Rental {
  id: string;
  hardwareId: string;
  userId: string;
  startDate: string; // ISO Date
  endDate: string;   // ISO Date
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
};

// Para cuando creamos un nuevo alquiler
export interface CreateRentalDTO {
  hardwareId: string;
  userId: string;
  startDate: string;
  endDate: string;
}