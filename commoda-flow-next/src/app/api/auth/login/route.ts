import { NextResponse } from 'next/server';
import { UserService } from '../../../../services/user.service';
import { ZodError } from 'zod';
import { registerSchema } from '../../../../schemas/user.schema'; 
import { cookies } from 'next/headers'; // <--- IMPORTANTE
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const cookieStore = await cookies(); // Obtenemos el gestor de cookies

    // 1. Intentar buscar al usuario
    const user = await UserService.findByEmail(email);

    if (user) {
      // CASO A: El usuario existe -> Validamos contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (isPasswordValid) {
        const { password: _, ...userWithoutPassword } = user;

        // --- CREAR COOKIE SESIÓN ---
        cookieStore.set('token-commoda', user.id, {
          httpOnly: true, // El navegador no puede leerla vía JS (protege vs XSS)
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 1 semana de duración
          path: '/',
        });

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
      const userData = {
        email,
        password,
        name: body.name || email.split('@')[0], 
      };

      const validatedData = registerSchema.parse(userData);
      const newUser = await UserService.create(validatedData);

      // --- CREAR COOKIE SESIÓN PARA NUEVO USUARIO ---
      cookieStore.set('token-commoda', newUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      
      return NextResponse.json({ 
        user: newUser, 
        message: "Usuario no encontrado. Se ha creado una cuenta nueva.",
      }, { status: 201 });

    } catch (zodError) {
      if (zodError instanceof ZodError) {
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