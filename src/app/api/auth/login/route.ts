import { NextResponse } from 'next/server';
import { UserService } from '../../../../services/user.service';
import { ZodError } from 'zod';
import { registerSchema } from '../../../../schemas/user.schema';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { users } from '../../../../types/user.types';

/**
 * `POST /api/auth/login`
 *
 * Endpoint combinado de **login** y **auto-registro**.
 * Opera en dos bloques según si el email ya existe en la base de datos:
 *
 * ### Bloque A — Login (el usuario existe)
 * 1. Verifica la contraseña con `bcrypt.compare`.
 * 2. Si es correcta, establece la cookie de sesión `token-commoda` (HttpOnly, 7 días).
 * 3. Devuelve el usuario sin contraseña con status 200.
 *
 * ### Bloque B — Registro (el usuario NO existe)
 * 1. Valida los datos con `registerSchema` (Zod).
 * 2. Hashea la contraseña con bcrypt (sal=10).
 * 3. Crea el usuario en la BD con rol `USER`.
 * 4. Establece la misma cookie de sesión.
 * 5. Devuelve el nuevo usuario con status 201.
 *
 * @remarks
 * Este diseño unificado reduce la fricción del usuario (un solo formulario para
 * login y registro), pero requiere que el cliente gestione el campo `name`
 * para el caso de registro.
 *
 * @returns `200` login correcto | `201` registro correcto |
 *          `400` datos inválidos | `401` contraseña incorrecta | `500` error interno.
 */
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
      const userRecord = user as users & { password: string };
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
          token: userWithoutPassword.id,
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
          token: newUser.id,
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
