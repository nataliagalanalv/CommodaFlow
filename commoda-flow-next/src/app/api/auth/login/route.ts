import { NextResponse } from 'next/server';
import { UserService } from '../../../../services/user.service';
import { ZodError } from 'zod';
import { registerSchema } from '../../../../schemas/user.schema'; 
import { cookies } from 'next/headers'; 
import bcrypt from 'bcryptjs';
import { User } from '../../../../types/user.types'; 

export async function POST(req: Request) {
  try {
    // 1. Extraemos el body y preparamos las cookies
    const body = await req.json();
    const cookieStore = await cookies();
    const { email, password } = body;

    // Validación rápida inicial por si mandan la petición vacía
    if (!email || !password) {
      return NextResponse.json({ message: "El email y la contraseña son obligatorios" }, { status: 400 });
    }

    // 2. Buscamos al usuario en Neon
    const user = await UserService.findByEmail(email);

    if (user) {
      // ==========================================
      // --- BLOQUE A: LOGIN (El usuario existe) ---
      // ==========================================
      const userRecord = user as User & { password: string };
      const isPasswordValid = await bcrypt.compare(password, userRecord.password);

      if (isPasswordValid) {
        const { password: _, ...userWithoutPassword } = userRecord;
        
        cookieStore.set('token-commoda', userWithoutPassword.id, { 
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 1 semana
          path: '/',
        });
        
        return NextResponse.json({ 
          user: userWithoutPassword, 
          message: "¡Bienvenido de nuevo!" 
        }, { status: 200 });

      } else {
        return NextResponse.json({ message: "Contraseña incorrecta" }, { status: 401 });
      }

    } else {
      // =======================================================
      // --- BLOQUE B: REGISTRO (El usuario NO existe) ---
      // =======================================================
      try {
        // 1. Preparamos los datos asumiendo un nombre por defecto si no lo envían
        const userDataToValidate = {
          email,
          password,
          name: body.name || email.split('@')[0], 
        };

        // 2. Validamos los datos estrictamente con Zod
        // Si falla, saltará automáticamente al bloque catch (innerError)
        const validatedData = registerSchema.parse(userDataToValidate);

        // 3. Encriptamos la contraseña ya validada
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        
        // 4. Creamos en base de datos (Recuerda: role 'user' en minúsculas)
        const newUser = await UserService.create({
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          role: 'USER'
        });

        // 5. Autenticamos al nuevo usuario
        cookieStore.set('token-commoda', newUser.id, { 
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });

        return NextResponse.json({ 
          user: newUser, 
          message: "Cuenta creada y sesión iniciada" 
        }, { status: 201 });

      } catch (innerError) {
        // Manejamos los errores específicos de Zod para darle un buen mensaje al usuario
        if (innerError instanceof ZodError) {
          return NextResponse.json({ 
            message: `Error de validación: ${innerError.issues[0].message}` 
          }, { status: 400 });
        }
        
        console.error("Error al crear cuenta:", innerError);
        return NextResponse.json({ message: "Error interno al crear cuenta" }, { status: 500 });
      }
    } 
  } catch (error) {
    console.error("Critical Auth Error:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  } 
}