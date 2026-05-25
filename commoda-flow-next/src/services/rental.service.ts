import { prisma } from '../lib/prisma';
import { rentals, Status } from '@prisma/client';

export const RentalService = {
  // Crear un alquiler
  async create(userId: string, hardwareId: string): Promise<rentals> {
    // Usamos una transacción para asegurar que si algo falla, no se cree el alquiler a medias
    return await prisma.$transaction(async (tx) => {
      // 1. Creamos el registro de alquiler
      const newRental = await tx.rentals.create({
        data: {
          userId,
          hardwareId,
          startDate: new Date(),
          status : 'RENTED'
        },
      });

      // 2. Cambiamos el estado del hardware a RENTED
      await tx.hardware.update({
        where: { id: hardwareId },
        data: { status: Status.RENTED },
      });

      return newRental;
    });
  },

  // Obtener alquileres de un usuario
  async getByUser(userId: string): Promise<rentals[]> {
    return await prisma.rentals.findMany({
      where: { userId },
      include: {
        hardware: true, 
        user: true,
      },
      orderBy: { startDate: 'desc' },
    });
  },

  // Finalizar un alquiler (Devolución)
  async finishRental(rentalId: string, hardwareId: string): Promise<rentals> {
    return await prisma.$transaction(async (tx) => {
      const newRental = await tx.rentals.update({
        where: { id: rentalId },
        data: { endDate: new Date() },
      });

      await tx.hardware.update({
        where: { id: hardwareId },
        data: { status: Status.AVAILABLE },
      });

      return newRental;
    });
  }
};