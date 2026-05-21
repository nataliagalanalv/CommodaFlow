import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../../../../services/user.service';
import { Prisma } from '@prisma/client';

// 1. Definimos la estructura exacta de lo que llega del Frontend
interface UpdateUserRequest {
  name?: string;
  avatarUrl?: string;
  password?: string;
}

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

    const dataToUpdate: Prisma.usersUpdateInput = {
      name: body.name,
        avatarUrl: body.avatarUrl,
      ...(body.password ? { password: body.password } : {})
    };

    // 4. Ejecutamos la actualización
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