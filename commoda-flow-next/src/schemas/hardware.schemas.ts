import { z } from 'zod';

export const hardwareSchema = z.object({
  model: z.string().min(2, "Modelo requerido"),
  specs: z.string().min(5, "Especificaciones requeridas"),
  category: z.enum(['LAPTOP', 'TABLET', 'PERIPHERAL']), 
  dailyRate: z.number().positive("El precio debe ser mayor a 0"),
  status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE']).optional().default('AVAILABLE'),
});

// Este tipo lo usarás en tus formularios de React
export type HardwareInput = z.infer<typeof hardwareSchema>;