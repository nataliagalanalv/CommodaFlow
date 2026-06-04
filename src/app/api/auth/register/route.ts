import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '../../../../lib/firebase-admin';
import { UserService } from '../../../../services/user.service';

/**
 * `POST /api/auth/register`
 *
 * Crea el perfil de usuario en Neon DB tras un registro completado en Firebase Auth.
 *
 * ### Flujo
 * 1. El cliente llama a `createUserWithEmailAndPassword` de Firebase y obtiene un ID token.
 * 2. Envía `{ idToken, name }` a este endpoint.
 * 3. El servidor verifica el token con Firebase Admin SDK y extrae `uid` + `email`.
 * 4. Crea el usuario en Neon DB con el Firebase `uid` como clave primaria (sin contraseña).
 * 5. Establece la cookie de sesión HttpOnly con el uid.
 * 6. Devuelve el usuario creado.
 *
 * @returns `201` usuario creado | `400` datos insuficientes | `409` ya existe | `500` error.
 */
export async function POST(req: Request) {
  try {
    const { idToken, name } = await req.json();

    if (!idToken || !name?.trim()) {
      return NextResponse.json({ error: 'Token y nombre son requeridos' }, { status: 400 });
    }

    // Verificar el ID token y obtener uid + email
    const decoded = await adminAuth.verifyIdToken(idToken);
    const { uid, email } = decoded;

    if (!email) {
      return NextResponse.json({ error: 'El token no contiene email' }, { status: 400 });
    }

    // Verificar que no exista ya en Neon DB
    const existing = await UserService.getById(uid);
    if (existing) {
      return NextResponse.json({ error: 'El usuario ya está registrado' }, { status: 409 });
    }

    // Crear perfil en Neon DB con Firebase uid como id (sin contraseña)
    const newUser = await UserService.create({
      id: uid,
      name: name.trim(),
      email,
      role: 'USER',
    });

    // Establecer cookie de sesión
    const cookieStore = await cookies();
    cookieStore.set('token-commoda', uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({ user: newUser, token: uid }, { status: 201 });

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json({ error: 'Error al crear el perfil de usuario' }, { status: 500 });
  }
}
