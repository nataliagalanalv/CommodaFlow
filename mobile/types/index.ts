/**
 * Estados operativos de un equipo de hardware en la aplicación móvil.
 * Los valores están en MAYÚSCULAS para coincidir con el enum `Status` de Prisma.
 * - `AVAILABLE`   → disponible para alquilar.
 * - `RENTED`      → prestado actualmente.
 * - `MAINTENANCE` → en taller, no disponible.
 */
export type HardwareStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';

/**
 * Categorías físicas de los equipos en la aplicación móvil.
 * Valores en MAYÚSCULAS para coincidir con el enum `Category` de Prisma.
 */
export type HardwareCategory = 'LAPTOP' | 'TABLET' | 'PERIPHERAL';

/**
 * Ciclo de vida completo de un alquiler en la aplicación móvil.
 * - `RENTED`    → alquiler activo, equipo en uso.
 * - `RETURNED`  → equipo devuelto correctamente.
 * - `OVERDUE`   → plazo vencido sin devolución.
 * - `PENDING`   → reserva creada, equipo no entregado aún.
 * - `COMPLETED` → alquiler finalizado y liquidado.
 */
export type RentalStatus = 'RENTED' | 'RETURNED' | 'OVERDUE' | 'PENDING' | 'COMPLETED';

/**
 * Niveles de acceso en el sistema.
 * - `USER`  → acceso estándar.
 * - `ADMIN` → acceso completo con privilegios de gestión.
 */
export type UserRole = 'USER' | 'ADMIN';

/**
 * Representación de un equipo de hardware tal como lo devuelve la API.
 */
export interface Hardware {
  /** UUID único del equipo en la base de datos. */
  id: string;
  /** Nombre comercial del equipo (p.ej. "Dell XPS 15"). */
  model: string;
  /** Descripción técnica resumida (RAM, CPU, almacenamiento, etc.). */
  specs: string;
  /** Categoría del dispositivo. */
  category: HardwareCategory;
  /** Precio de alquiler en euros por día natural. */
  dailyRate: number;
  /** Estado operativo actual del equipo. */
  status: HardwareStatus;
  /** URL opcional de imagen representativa. */
  image?: string;
}

/**
 * Registro completo de un alquiler con relaciones opcionales incluidas.
 */
export interface Rental {
  /** UUID único del alquiler. */
  id: string;
  /** Referencia al equipo alquilado. */
  hardwareId: string;
  /** Referencia al usuario que realizó el alquiler. */
  userId: string;
  /** Fecha de inicio en formato ISO 8601 (YYYY-MM-DD). */
  startDate: string;
  /** Fecha prevista de devolución en formato ISO 8601 (YYYY-MM-DD). */
  endDate: string;
  /** Estado actual del alquiler. */
  status: RentalStatus;
  /** Precio total calculado al crear el alquiler (días × tarifa diaria). Coincide con el campo `totalPrice` de Prisma. */
  totalPrice: number;
  /** Datos del hardware relacionado (incluidos opcionalmente en la respuesta de la API). */
  hardware?: {
    model: string;
    dailyRate: number;
    category: string;
  };
  /** Datos del usuario relacionado (incluidos opcionalmente en la respuesta de la API). */
  user?: {
    name: string;
    email: string;
  };
}

/**
 * Datos públicos de un usuario autenticado en la aplicación móvil.
 */
export interface User {
  /** UUID único del usuario. */
  id: string;
  /** Nombre completo del usuario. */
  name: string;
  /** Correo electrónico usado como identificador de login. */
  email: string;
  /** Nivel de acceso del usuario en el sistema. */
  role: UserRole;
}

/**
 * DTO para crear un nuevo alquiler desde la aplicación móvil.
 * El servidor calcula `totalPrice` y establece el estado inicial.
 */
export interface CreateRentalDTO {
  /** ID del equipo a alquilar. */
  hardwareId: string;
  /** ID del usuario que realiza el alquiler. */
  userId: string;
  /** Fecha de inicio en formato ISO 8601 (YYYY-MM-DD). */
  startDate: string;
  /** Fecha de devolución en formato ISO 8601 (YYYY-MM-DD). */
  endDate: string;
}

// ── Type guards ────────────────────────────────────────────────────────────────

/**
 * Determina si un alquiler está vencido en tiempo de ejecución.
 * Considera vencido tanto el estado explícito `OVERDUE` como cualquier
 * alquiler cuya fecha de fin ya haya pasado, independientemente del estado en BD.
 *
 * @param rental - Alquiler a evaluar.
 * @returns `true` si el alquiler está vencido.
 */
export function isOverdue(rental: Rental): boolean {
  return rental.status === 'OVERDUE' || new Date(rental.endDate) < new Date();
}

/**
 * Determina si un equipo de hardware está disponible para alquilar.
 *
 * @param hardware - Equipo a evaluar.
 * @returns `true` si el equipo puede alquilarse en este momento.
 */
export function isAvailable(hardware: Hardware): boolean {
  return hardware.status === 'AVAILABLE';
}
