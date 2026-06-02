/**
 * Posibles estados operativos de un equipo en el sistema.
 * - `available` → disponible para alquilar.
 * - `rented`    → actualmente prestado a un usuario.
 * - `maintenance` → en taller; no puede alquilarse.
 *
 * @remarks Los valores están en minúsculas porque la API web normaliza el campo
 * `status` de la base de datos antes de devolverlo al frontend.
 */
export type HardwareStatus = 'available' | 'rented' | 'maintenance';

/**
 * Categorías físicas del hardware gestionado por CommodaFlow.
 * - `laptop`     → portátiles y equipos de sobremesa.
 * - `tablet`     → tablets y e-readers.
 * - `peripheral` → ratones, teclados, proyectores y otros accesorios.
 */
export type HardwareCategory = 'laptop' | 'tablet' | 'peripheral';

/**
 * Representación de un equipo tal como lo devuelve la API REST.
 * Coincide directamente con el modelo `Hardware` de Prisma, excepto
 * que `status` y `category` se normalizan a minúsculas en el servicio.
 */
export interface APIHardware {
  /** UUID único generado por la base de datos (Neon/PostgreSQL). */
  id: string;
  /** Nombre comercial del equipo (p.ej. "MacBook Pro M3 14\""). */
  model: string;
  /** Descripción técnica resumida (RAM, almacenamiento, chip, etc.). */
  specs: string;
  /** Tipo de dispositivo según la taxonomía del negocio. */
  category: HardwareCategory;
  /** Precio de alquiler en euros por día natural. */
  dailyRate: number;
  /** Estado actual del equipo dentro del flujo de alquiler. */
  status: HardwareStatus;
  /** URL opcional de imagen representativa del equipo. */
  image?: string;
}

/**
 * Tipo extendido de `APIHardware` que la aplicación utiliza internamente.
 * Actualmente es equivalente a `APIHardware`, pero se mantiene separado
 * para poder añadir campos calculados o de presentación en el futuro.
 */
export interface Hardware extends APIHardware {
  category: HardwareCategory;
}
