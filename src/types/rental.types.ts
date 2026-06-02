/**
 * Ciclo de vida de un alquiler en CommodaFlow.
 * - `RENTED`    → equipo prestado actualmente en uso.
 * - `RETURNED`  → equipo devuelto correctamente.
 * - `OVERDUE`   → el plazo de devolución ha vencido sin devolución.
 * - `PENDING`   → reserva creada pero el equipo aún no se ha entregado.
 * - `COMPLETED` → alquiler finalizado y liquidado.
 */
export type RentalStatus = 'RENTED' | 'RETURNED' | 'OVERDUE' | 'PENDING' | 'COMPLETED';

/**
 * Registro completo de un alquiler tal como lo devuelve la API con sus
 * relaciones incluidas (`hardware` y `user`).
 */
export interface Rental {
  /** UUID único del alquiler generado por la base de datos. */
  id: string;
  /** Referencia al equipo alquilado (clave foránea hacia `Hardware.id`). */
  hardwareId: string;
  /** Referencia al usuario que realizó el alquiler (clave foránea hacia `users.id`). */
  userId: string;
  /** Fecha de inicio del alquiler en formato ISO 8601 (YYYY-MM-DD). */
  startDate: string; // ISO Date
  /** Fecha prevista de devolución en formato ISO 8601 (YYYY-MM-DD). */
  endDate: string;   // ISO Date
  /** Estado actual del alquiler dentro de su ciclo de vida. */
  status: RentalStatus;
  /** Coste total calculado al crear el alquiler (días × tarifa diaria). */
  totalCost: number;

  /**
   * Datos del equipo relacionado, incluidos mediante JOIN en la consulta.
   * Opcional porque algunas consultas ligeras no incluyen la relación.
   */
  hardware?: {
    model: string;
    dailyRate: number;
    category: string;
  };

  /**
   * Datos del usuario relacionado, incluidos mediante JOIN en la consulta.
   * Opcional porque algunas consultas ligeras no incluyen la relación.
   */
  user?: {
    name: string;
    email: string;
  };
}

/**
 * DTO (Data Transfer Object) usado al crear un nuevo alquiler desde el cliente.
 * Contiene únicamente los campos que el usuario introduce; el servidor
 * calcula `totalCost` y establece el estado inicial (`RENTED`).
 */
export interface CreateRentalDTO {
  /** ID del equipo que se quiere alquilar. */
  hardwareId: string;
  /** ID del usuario que realiza el alquiler. */
  userId: string;
  /** Fecha de inicio en formato ISO 8601 (YYYY-MM-DD). */
  startDate: string;
  /** Fecha de fin deseada en formato ISO 8601 (YYYY-MM-DD). */
  endDate: string;
}
