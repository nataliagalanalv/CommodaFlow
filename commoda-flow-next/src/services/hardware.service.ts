import { prisma } from '../lib/prisma';
import { Hardware, Prisma } from '@prisma/client';

export const HardwareService = {
  /**
   * Obtiene todo el inventario ordenado por fecha de creación.
   * Retorna una promesa con un array de Hardware.
   */
  async getAll(): Promise<Hardware[]> {
    return await prisma.hardware.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  /**
   * Crea un nuevo equipo.
   * @param data - Debe cumplir con la estructura definida en schema.prisma
   */
  async create(data: Prisma.HardwareCreateInput): Promise<Hardware> {
    return await prisma.hardware.create({
      data
    });
  },

  /**
   * Obtiene un equipo por su ID único.
   */
  async getById(id: string): Promise<Hardware | null> {
    return await prisma.hardware.findUnique({
      where: { id }
    });
  },

  /**
   * Actualiza los datos de un equipo existente.
   */
  async update(id: string, data: Prisma.HardwareUpdateInput): Promise<Hardware> {
    return await prisma.hardware.update({
      where: { id },
      data
    });
  }
};