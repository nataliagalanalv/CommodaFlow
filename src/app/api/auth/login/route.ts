import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '../../../../lib/firebase-admin';
import { UserService } from '../../../../services/user.service';

/**
 * `POST /api/auth/login`
 *
 * Establece la sesión web tras un login completado en el cliente con Firebase Auth.
 *
 * ### Flujo
 * 1. El cliente llama a `signInWithEmailAndPassword` de Firebase y obtiene un ID token.
 * 2. Envía ese token a este endpoint.
 * 3. El servidor verifica el token con Firebase Admin SDK.
 * 4. Extrae el `uid` del token, busca el usuario en Neon DB.
 * 5. Guarda el `uid` en la cookie HttpOnly `token-commoda` para las peticiones siguientes.
 * 6. Devuelve los datos del usuario al cliente.
 *
 * @returns `200` sesión iniciada | `401` token inválido | `404` usuario no encontrado | `500` error.
 */
export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    // Verificar el ID token con Firebase Admin SDK
    const decoded = await adminAuth.verifyIdToken(idToken);
    const { uid } = decoded;

    // Buscar el usuario en Neon DB usando el Firebase uid
    const user = await UserService.getById(uid);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado en la base de datos' }, { status: 404 });
    }

    // Establecer cookie de sesión con el Firebase uid
    const cookieStore = await cookies();
    cookieStore.set('token-commoda', uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({ user, token: uid }, { status: 200 });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Token inválido o sesión expirada' }, { status: 401 });
  }
}
