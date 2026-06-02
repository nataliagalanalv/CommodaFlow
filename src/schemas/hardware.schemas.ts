import { z } from 'zod';

/**
 * Esquema de validación Zod para crear o actualizar un equipo de hardware.
 *
 * Se aplica en la ruta `POST /api/hardware` antes de persistir en la base de datos,
 * garantizando que:
 * - El modelo tenga un mínimo de 2 caracteres descriptivos.
 * - Las especificaciones técnicas no estén vacías.
 * - La categoría sea uno de los tres tipos reconocidos por el sistema.
 * - El precio diario sea positivo (sin equipos gratuitos ni tarifas negativas).
 * - El estado inicial por defecto sea `AVAILABLE` si no se especifica.
 */
export const hardwareSchema = z.object({
  /** Nombre comercial del equipo (mínimo 2 caracteres). */
  model: z.string().min(2, "Modelo requerido"),
  /** Descripción técnica resumida (RAM, chip, almacenamiento, etc.). */
  specs: z.string().min(3, "Especificaciones requeridas"),
  /**
   * Tipo de dispositivo.
   * Debe coincidir exactamente con los valores del enum `Category` de Prisma.
   */
  category: z.enum(['LAPTOP', 'TABLET', 'PERIPHERAL']),
  /** Tarifa de alquiler en euros por día natural. Debe ser mayor que 0. */
  dailyRate: z.number().positive("El precio debe ser mayor a 0"),
  /**
   * Estado operativo inicial.
   * Se establece a `AVAILABLE` automáticamente si el cliente no lo especifica,
   * ya que un equipo recién dado de alta debería estar disponible de inmediato.
   */
  status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE']).optional().default('AVAILABLE'),
});

/**
 * Tipo TypeScript inferido a partir de `hardwareSchema`.
 * Úsalo en formularios de React y en las funciones de servicio para
 * garantizar que el tipado es consistente con la validación en tiempo de ejecución.
 */
export type HardwareInput = z.infer<typeof hardwareSchema>;
