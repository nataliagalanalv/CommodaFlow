export type RentalStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface Rental {
  id: string;
  hardwareId: string; // Referencia al equipo
  userId: string;     // Referencia al usuario de AuthContext
  startDate: string;  // ISO Date string
  endDate: string;    // ISO Date string
  totalPrice: number;
  status: RentalStatus;
}