import { NextResponse } from 'next/server';
import { RentalService } from '../../../services/rental.service';

/**
 * `POST /api/rentals`
 *
 * Crea un nuevo alquiler vinculando un usuario con un equipo.
 * La operación es atómica: crea el registro de alquiler y cambia el
 * estado del hardware a `RENTED` en la misma transacción de BD.
 *
 * ### Body esperado
 * ```json
 * { "userId": "uuid", "hardwareId": "uuid" }
 * ```
 *
 * @returns `201` alquiler creado | `400` faltan campos | `500` error interno.
 */
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

/**
 * `GET /api/rentals?userId=<uuid>`
 *
 * Devuelve todos los alquileres de un usuario específico (activos e histórico),
 * con los datos del hardware y del usuario relacionados incluidos.
 *
 * ### Query params
 * - `userId` (requerido) → UUID del usuario cuyos alquileres se consultan.
 *
 * @returns `200` array de alquileres | `400` falta `userId` | `500` error interno.
 */
export async function GET(req: Request) {
  try {
    // Obtenemos el userId de los parámetros de la URL (?userId=123)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "Falta el userId" }, { status: 400 });
    }

    // Llamamos al servicio (asegúrate de crear este método en tu RentalService)
    const rentals = await RentalService.getByUser(userId);

    return NextResponse.json(rentals, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo alquileres:", error);
    return NextResponse.json({ error: "Error al obtener alquileres" }, { status: 500 });
  }
}
