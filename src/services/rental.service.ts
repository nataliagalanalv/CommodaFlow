import { prisma } from '../lib/prisma';
import { rentals, Status } from '@prisma/client';

/**
 * Servicio de acceso a datos para el modelo `rentals`.
 *
 * Gestiona el ciclo de vida completo de los alquileres:
 * creación, consulta y devolución. Todas las operaciones que cambian
 * simultáneamente el estado del alquiler y del hardware utilizan
 * transacciones de Prisma para garantizar la integridad de los datos.
 */
export const RentalService = {
  /**
   * Crea un nuevo alquiler y marca el hardware como ocupado en una sola operación atómica.
   *
   * La transacción garantiza que:
   * 1. Si la creación del alquiler falla, el hardware **no** cambia de estado.
   * 2. Si la actualización del hardware falla, el alquiler **no** se crea.
   *
   * @param userId     - UUID del usuario que realiza el alquiler.
   * @param hardwareId - UUID del equipo a alquilar (debe estar en estado `AVAILABLE`).
   * @returns El registro del alquiler recién creado.
   */
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

  /**
   * Obtiene todos los alquileres de un usuario concreto, incluyendo los datos
   * del hardware y del usuario relacionados, ordenados de más reciente a más antiguo.
   *
   * @param userId - UUID del usuario cuyos alquileres se quieren consultar.
   * @returns Array de alquileres con las relaciones `hardware` y `user` pobladas.
   */
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

  /**
   * Finaliza un alquiler registrando la fecha de devolución y liberando el equipo.
   *
   * Opera en transacción para evitar escenarios donde el alquiler se cierre
   * pero el hardware quede marcado como alquilado indefinidamente (o viceversa).
   *
   * @param rentalId   - UUID del alquiler a finalizar.
   * @param hardwareId - UUID del hardware a liberar (vuelve a `AVAILABLE`).
   * @returns El registro del alquiler actualizado con la `endDate` asignada.
   */
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
