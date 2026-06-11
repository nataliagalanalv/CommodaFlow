import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

/**
 * `PATCH /api/rentals/[id]/return`
 *
 * Procesa la devolución de un equipo alquilado.
 * Opera en una transacción de Prisma para garantizar atomicidad:
 * - Marca el alquiler como `RETURNED`.
 * - Libera el equipo cambiando su estado a `AVAILABLE`.
 *
 * Si cualquiera de los dos pasos falla, la transacción se revierte y
 * ambos registros quedan en su estado original.
 *
 * @param request - Petición entrante (el body no se usa; toda la info viene en la URL).
 * @param params  - Parámetros de ruta dinámicos; `id` es el UUID del alquiler a cerrar.
 *
 * @returns `200 { message }` devolución correcta |
 *          `404` alquiler no encontrado | `500` error interno.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 1. Declaramos params como Promise
) {
  try {
    // 2. Esperamos a que los params se resuelvan
    const { id: rentalId } = await params;

    // Buscamos el alquiler para saber qué hardware liberar
    const rental = await prisma.rentals.findUnique({
      where: { id: rentalId }
    });

    if (!rental) {
      return NextResponse.json({ error: "Alquiler no encontrado" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.rentals.update({
        where: { id: rentalId },
        data: { status: 'RETURNED' }
      }),
      prisma.hardware.update({
        where: { id: rental.hardwareId },
        data: { status: 'AVAILABLE' }
      })
    ]);

    return NextResponse.json({ message: "Equipo devuelto correctamente" });

  } catch (error) {
    console.error("Build Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
