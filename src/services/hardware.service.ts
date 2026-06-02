import { prisma } from '../lib/prisma';
import { Hardware, Prisma } from '@prisma/client';

/**
 * Servicio de acceso a datos para el modelo `Hardware`.
 *
 * Encapsula todas las operaciones CRUD sobre equipos de hardware,
 * manteniendo los route handlers libres de lógica de base de datos.
 * Utiliza el cliente Prisma singleton de `lib/prisma`.
 */
export const HardwareService = {
  /**
   * Obtiene todo el inventario de equipos registrados en el sistema,
   * ordenado del más reciente al más antiguo según fecha de alta.
   *
   * @returns Promesa con el array completo de equipos (puede estar vacío).
   */
  async getAll(): Promise<Hardware[]> {
    return await prisma.hardware.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  /**
   * Registra un nuevo equipo en el inventario.
   *
   * @param data - Datos del equipo. Debe cumplir con la estructura
   *               `Prisma.HardwareCreateInput`, que incluye `model`, `specs`,
   *               `category`, `dailyRate` y opcionalmente `status`.
   * @returns El equipo recién creado con su UUID asignado por la BD.
   */
  async create(data: Prisma.HardwareCreateInput): Promise<Hardware> {
    return await prisma.hardware.create({
      data
    });
  },

  /**
   * Busca un equipo por su identificador único.
   * Útil antes de crear alquileres para verificar existencia y disponibilidad.
   *
   * @param id - UUID del equipo a buscar.
   * @returns El equipo si existe, o `null` si no se encuentra.
   */
  async getById(id: string): Promise<Hardware | null> {
    return await prisma.hardware.findUnique({
      where: { id }
    });
  },

  /**
   * Actualiza los campos de un equipo existente.
   * Habitualmente usado para cambiar el `status` al crear o finalizar alquileres.
   *
   * @param id   - UUID del equipo a actualizar.
   * @param data - Campos a modificar (parcial de `HardwareUpdateInput`).
   * @returns El equipo con los datos actualizados.
   */
  async update(id: string, data: Prisma.HardwareUpdateInput): Promise<Hardware> {
    return await prisma.hardware.update({
      where: { id },
      data
    });
  }
};
