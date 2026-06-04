import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../../../../services/user.service';
import { UpdateUserRequest } from '../../../../types/user.types';

/**
 * `PATCH /api/users/[id]`
 *
 * Actualiza el perfil de un usuario en Neon DB. Solo acepta el campo `name`;
 * la contraseña se gestiona en Firebase Auth (no pasa por este endpoint).
 *
 * @param request - Petición PATCH con body `{ name? }`.
 * @param context - Contexto de ruta; `params.id` es el Firebase uid del usuario.
 *
 * @returns `200` usuario actualizado | `400` sin ID o sin campos | `500` error.
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

    // Solo se permite actualizar el nombre; el resto se ignora
    const dataToUpdate: UpdateUserRequest = {
      ...(body.name !== undefined && { name: body.name }),
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
