import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '../../../../../lib/prisma'; 
import { Status } from '@prisma/client';


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