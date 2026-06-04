import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { UserService } from '../../../../services/user.service';

/**
 * `GET /api/auth/me`
 *
 * Introspección de sesión: devuelve los datos del usuario autenticado.
 * Se invoca durante el montaje de `AuthProvider` para restaurar la sesión
 * desde la cookie HttpOnly sin que el cliente vuelva a hacer login.
 *
 * La cookie `token-commoda` almacena el Firebase uid del usuario.
 *
 * @returns `200 { user }` con datos del usuario | `401 { user: null }` sin sesión.
 */
export async function GET() {
  const cookieStore = await cookies();
  const uid = cookieStore.get('token-commoda')?.value;

  if (!uid) return NextResponse.json({ user: null }, { status: 401 });

  const user = await UserService.getById(uid);
  if (!user) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json({ user });
}
