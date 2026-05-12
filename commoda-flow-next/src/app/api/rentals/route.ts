import { NextResponse } from 'next/server';
import { RentalService } from '../../../services/rental.service';

export async function POST(req: Request) {
  try {
    const { userId, hardwareId } = await req.json();

    if (!userId || !hardwareId) {
      return NextResponse.json({ error: "Faltan datos (userId o hardwareId)" }, { status: 400 });
    }

    const rental = await RentalService.create(userId, hardwareId);
    return NextResponse.json(rental, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo procesar el alquiler" }, { status: 500 });
  }
}