import { NextResponse } from 'next/server';
import { UserService } from '../../../../services/user.service';
import { ZodError } from 'zod';
import { registerSchema } from '../../../../schemas/user.schema'; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Intentar buscar al usuario
    const user = await UserService.findByEmail(email);

    if (user) {
      // CASO A: El usuario existe -> Validamos contraseña
      if (user.password === password) {
        return NextResponse.json({ user, message: "¡Bienvenido de nuevo!" }, { status: 200 });
      } else {
        return NextResponse.json({ message: "La contraseña es incorrecta" }, { status: 401 });
      }
    }

    // CASO B: El usuario no existe -> Intentamos crear uno nuevo
    // Primero validamos los datos con tu esquema de Zod
    try {
      const validatedData = registerSchema.parse(body);
      const newUser = await UserService.create(validatedData);
      
      return NextResponse.json({ 
        user: newUser, 
        message: "Usuario no encontrado. Se ha creado una cuenta nueva.",
        isNew: true 
      }, { status: 201 });

    } catch (zodError) {
      if (zodError instanceof ZodError) {
        return NextResponse.json({ message: zodError.issues[0].message }, { status: 400 });
      }
      throw zodError;
    }

  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}