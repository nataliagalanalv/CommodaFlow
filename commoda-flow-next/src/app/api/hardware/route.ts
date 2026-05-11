import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { Category } from '@prisma/client';

export async function GET() {
  try {
    const allHardware = await prisma.hardware.findMany();
    return NextResponse.json(allHardware);
  } catch (error) {
    console.error("Error al obtener hardware:", error);
    return NextResponse.json({ error: "Error al obtener hardware" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json()

  if (!Object.values(Category).includes(body.category)) {
    return NextResponse.json(
      { error: `Categoría no válida. Valores permitidos: ${Object.values(Category).join(', ')}` },
      { status: 400 }
    )
  }

  try {
    const newEquipment = await prisma.hardware.create({
      data: {
        model: body.model,
        category: body.category,
        specs: body.specs,
        dailyRate: body.dailyRate,
      }
    })
    return NextResponse.json(newEquipment, { status: 201 })
  } catch (error) {
    console.error("Error al crear equipo:", error);
    return NextResponse.json({ error: 'Error al crear equipo' }, { status: 500 })
  }
}