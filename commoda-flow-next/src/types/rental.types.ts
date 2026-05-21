export type RentalStatus = 'active' | 'returned' | 'overdue' | 'pending' | 'completed';

export interface Rental {
  id: string;
  hardwareId: string;
  userId: string;
  startDate: string; // ISO Date
  endDate: string;   // ISO Date
  status: RentalStatus;
  totalCost: number;
  
  // Opcional: Campos "poblados" para mostrar info sin buscar otra vez
  hardware?: {
    model: string;
    dailyRate: number;
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