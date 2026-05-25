import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../../../../services/user.service';
import { UpdateUserRequest } from '../../../../types/user.types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params;
    const body: UpdateUserRequest = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID de usuario no proporcionado" }, 
        { status: 400 }
      );
    }

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