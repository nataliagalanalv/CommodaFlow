import { NextResponse } from 'next/server';
import { UserService } from '../../../../services/user.service';
import { registerSchema } from '../../../../schemas/user.schema'; 
import { ZodError } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await UserService.findByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
    }

    const newUser = await UserService.create(validatedData);
    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
  if (error instanceof ZodError) {
    // Usamos .issues para acceder a la lista de errores de validación
    return NextResponse.json(
      { error: error.issues[0].message }, 
      { status: 400 }
    );
  }
  
  console.error("Server Error:", error);
  return NextResponse.json(
    { error: "Error interno del servidor" }, 
    { status: 500 }
  );
}
}