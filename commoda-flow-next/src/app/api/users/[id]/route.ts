import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../../../../services/user.service';
import { UpdateUserRequest } from '../../../../types/user.types';

/**
 * `PATCH /api/users/[id]`
 *
 * Actualiza los datos modificables del perfil de un usuario.
 * Solo acepta los campos `name` y/o `password`; cualquier otro campo
 * del body se ignora para evitar escaladas de privilegios.
 *
 * ### Manejo de contraseña
 * Si `password` se incluye en el body, `UserService.update` la hashea con
 * bcrypt antes de almacenarla; el cliente siempre envía la contraseña en
 * texto plano y el servidor garantiza que nunca se persiste sin cifrar.
 *
 * @param request - Petición PATCH con body `{ name?, password? }`.
 * @param context - Contexto de ruta; `params.id` es el UUID del usuario a modificar.
 *
 * @returns `200` usuario actualizado (sin contraseña) |
 *          `400` sin ID o sin campos válidos | `500` error interno o usuario no encontrado.
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body: UpdateUserRequest = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID de usuario no proporcionado" },
        { status: 400 }
      );
    }

    // Filtrar solo los campos permitidos para evitar modificaciones no autorizadas
    const dataToUpdate: UpdateUserRequest = {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.password !== undefined && { password: body.password }),
    };

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron campos para actualizar" },
        { status: 400 }
      );
    }

    const updatedUser = await UserService.update(id, dataToUpdate);
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error("Error en API update:", errorMessage);
    return NextResponse.json(
      { error: "Error al actualizar el usuario", details: errorMessage },
      { status: 500 }
    );
  }
}
