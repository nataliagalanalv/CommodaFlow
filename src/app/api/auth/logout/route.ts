import { NextResponse } from 'next/server';

/**
 * `POST /api/auth/logout`
 *
 * Cierra la sesión del usuario eliminando la cookie de autenticación.
 *
 * ### Estrategia de invalidación
 * La cookie `token-commoda` se invalida estableciendo su fecha de expiración
 * en el pasado (Unix epoch 0). Esta técnica es más fiable que simplemente
 * eliminar la cookie porque funciona correctamente en todos los navegadores
 * con las mismas opciones de seguridad con las que fue creada.
 *
 * @remarks
 * El cliente (`AuthProvider.logout`) también limpia el localStorage y
 * hace `window.location.replace('/login')` como medida adicional de seguridad.
 *
 * @returns `200 { message }` siempre (el logout nunca debe fallar desde la perspectiva del usuario).
 */
export async function POST() {
  // Creamos la respuesta
  const response = NextResponse.json(
    { message: 'Sesión cerrada correctamente' },
    { status: 200 }
  );

  response.cookies.set('token-commoda', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });

  return response;
}
