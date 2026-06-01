import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { UserService } from '../../../../services/user.service';

/**
 * `GET /api/auth/me`
 *
 * Endpoint de introspección de sesión.
 * Permite al cliente web comprobar si existe una sesión activa y obtener
 * los datos del usuario autenticado sin necesidad de volver a hacer login.
 *
 * ### Uso principal
 * Se invoca durante el montaje del `AuthProvider` (y en `refreshUser`) para
 * hidratar el estado de autenticación en el contexto de React desde la cookie
 * HttpOnly (que JavaScript no puede leer directamente).
 *
 * ### Flujo
 * 1. Lee la cookie `token-commoda` (contiene el UUID del usuario).
 * 2. Si no existe, devuelve `{ user: null }` con status 401.
 * 3. Si existe, consulta la BD y devuelve los datos públicos del usuario.
 *
 * @returns `200 { user }` con datos del usuario | `401 { user: null }` sin sesión.
 */
export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('token-commoda')?.value;

  if (!userId) return NextResponse.json({ user: null }, { status: 401 });

  const user = await UserService.getById(userId); // Crea este método en tu service
  return NextResponse.json({ user });
}
