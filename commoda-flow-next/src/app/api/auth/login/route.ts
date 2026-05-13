import { NextResponse } from 'next/server';
import { UserService } from '../../../../services/user.service';
import { ZodError } from 'zod';
import { registerSchema } from '../../../../schemas/user.schema'; 
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Intentar buscar al usuario
    const user = await UserService.findByEmail(email);

    if (user) {
      // CASO A: El usuario existe -> Validamos contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (isPasswordValid) {
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json({ 
          user: userWithoutPassword, 
          message: "¡Bienvenido de nuevo!" 
        }, { status: 200 });
      } else {
        return NextResponse.json({ message: "La contraseña es incorrecta" }, { status: 401 });
      }
    }

    // CASO B: Registro automático
    try {
      // Si tu esquema pide 'name', lo generamos del email para evitar el 400
      const userData = {
        email,
        password,
        name: body.name || email.split('@')[0], 
      };

      const validatedData = registerSchema.parse(userData);
      const newUser = await UserService.create(validatedData);
      
      return NextResponse.json({ 
        user: newUser, 
        message: "Usuario no encontrado. Se ha creado una cuenta nueva.",
      }, { status: 201 });

    } catch (zodError) {
      if (zodError instanceof ZodError) {
        // Esto te dirá exactamente qué campo falta en la consola de Vercel
        console.error("Zod Error Details:", zodError.issues);
        return NextResponse.json({ 
          message: `Error de validación: ${zodError.issues[0].message}` 
        }, { status: 400 });
      }
      throw zodError;
    }

  } catch (error) {
    console.error("Critical Auth Error:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}