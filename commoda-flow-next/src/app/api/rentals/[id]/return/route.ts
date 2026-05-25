import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma'; // Ajusta la ruta a tu cliente de Prisma

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rentalId = params.id;

    // Buscamos el alquiler para saber qué hardware liberar
    const rental = await prisma.rentals.findUnique({
      where: { id: rentalId }
    });

    if (!rental) {
      return NextResponse.json({ error: "Alquiler no encontrado" }, { status: 404 });
    }

    // Ejecutamos ambas actualizaciones en una transacción segura
    await prisma.$transaction([
      // 1. Marcamos el alquiler como devuelto/completado
      prisma.rentals.update({
        where: { id: rentalId },
        data: { status: 'RETURNED' } // Usa el string que tengas definido en tu DB
      }),
      // 2. Liberamos el equipo
      prisma.hardware.update({
        where: { id: rental.hardwareId },
        data: { Status : 'AVAILABLE  ' } // Usa el string que tengas definido en tu DB
      })
    ]);

    return NextResponse.json({ message: "Equipo devuelto correctamente" });

  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}