import { NextResponse } from 'next/server';
import { HardwareService } from '../../../services/hardware.service';
import { hardwareSchema } from '../../../schemas/hardware.schemas';

export async function GET() {
  try {
    // La ruta solo pide los datos al servicio
    const allHardware = await HardwareService.getAll();
    return NextResponse.json(allHardware);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener hardware" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Zod ahora validará que venga 'dailyRate' y no 'price'
    const validatedData = hardwareSchema.parse(body);

    // El servicio ahora recibirá exactamente lo que Prisma espera
    const newEquipment = await HardwareService.create(validatedData);
    
    return NextResponse.json(newEquipment, { status: 201 });
  } catch (error) {
    console.error("Error en POST hardware:", error);
    return NextResponse.json(
      { error: 'Datos de hardware inválidos. Asegúrate de enviar dailyRate y categorías correctas.' }, 
      { status: 400 }
    );
  }
}