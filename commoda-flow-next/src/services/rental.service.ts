import { prisma } from '../lib/prisma';
import { Rental, HardwareStatus } from '@prisma/client';

export const RentalService = {
  // Crear un alquiler
  async create(userId: string, hardwareId: string): Promise<Rental> {
    // Usamos una transacción para asegurar que si algo falla, no se cree el alquiler a medias
    return await prisma.$transaction(async (tx) => {
      // 1. Creamos el registro de alquiler
      const rental = await tx.rental.create({
        data: {
          userId,
          hardwareId,
          startDate: new Date(),
        },
      });

      // 2. Cambiamos el estado del hardware a RENTED
      await tx.hardware.update({
        where: { id: hardwareId },
        data: { status: HardwareStatus.RENTED },
      });

      return rental;
    });
  },

  // Obtener alquileres de un usuario
  async getByUser(userId: string): Promise<Rental[]> {
    return await prisma.rental.findMany({
      where: { userId },
      include: {
        hardware: true, // Incluimos los datos del equipo para ver qué alquiló
      },
      orderBy: { startDate: 'desc' },
    });
  },

  // Finalizar un alquiler (Devolución)
  async finishRental(rentalId: string, hardwareId: string): Promise<Rental> {
    return await prisma.$transaction(async (tx) => {
      const rental = await tx.rental.update({
        where: { id: rentalId },
        data: { endDate: new Date() },
      });

      await tx.hardware.update({
        where: { id: hardwareId },
        data: { status: HardwareStatus.AVAILABLE },
      });

      return rental;
    });
  }
};