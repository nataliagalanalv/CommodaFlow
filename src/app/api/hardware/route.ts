import { NextResponse } from 'next/server';
import { HardwareService } from '../../../services/hardware.service';
import { hardwareSchema } from '../../../schemas/hardware.schemas';

/**
 * `GET /api/hardware`
 *
 * Devuelve el inventario completo de equipos ordenado por fecha de alta descendente.
 * No requiere autenticación para facilitar el acceso desde la app móvil sin sesión
 * activa (el middleware de la versión web lo protege indirectamente).
 *
 * @returns `200` array de equipos | `500` error al consultar la BD.
 */
export async function GET() {
  try {
    // La ruta solo pide los datos al servicio
    const allHardware = await HardwareService.getAll();
    return NextResponse.json(allHardware);
  } catch {
    return NextResponse.json({ error: "Error al obtener hardware" }, { status: 500 });
  }
}

/**
 * `POST /api/hardware`
 *
 * Crea un nuevo equipo en el inventario. Acción reservada para administradores
 * (el componente `AdminGuard` protege la UI; la API confía en esa protección).
 *
 * ### Flujo
 * 1. Parsea el body con `hardwareSchema` (Zod).
 * 2. Delega la inserción en `HardwareService.create`.
 * 3. Devuelve el equipo creado con su UUID asignado.
 *
 * @returns `201` equipo creado | `400` datos inválidos según el schema.
 */
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
