import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de autenticación de Next.js para la aplicación web de CommodaFlow.
 *
 * ### Lógica de acceso
 * | Situación                              | Acción                             |
 * |----------------------------------------|------------------------------------|
 * | Sin cookie + ruta pública (login/reg.) | Deja pasar (`NextResponse.next()`) |
 * | Sin cookie + ruta protegida            | Redirige a `/login`                |
 * | Con cookie + ruta de login/registro    | Redirige a `/` (ya autenticado)    |
 * | Con cookie + cualquier otra ruta       | Deja pasar                         |
 *
 * ### Cookie de sesión
 * La cookie `token-commoda` contiene el **UUID del usuario** (no un JWT),
 * establecida con `httpOnly: true` para impedir que JavaScript del cliente
 * pueda leerla o robarla.
 *
 * @param request - Objeto de la petición entrante proporcionado por el runtime de Next.js.
 * @returns `NextResponse` de redirección o paso (next).
 */
export default function middleware(request: NextRequest) {
  const token = request.cookies.get('token-commoda')?.value;
  const { pathname } = request.nextUrl;

  if (!token) {
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Si hay token, no dejar entrar en login o register (redirigir a home)
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

/**
 * Configuración del matcher del middleware.
 * Excluye deliberadamente:
 * - `api/`        → las rutas de API gestionan su propia autenticación.
 * - `_next/static` y `_next/image` → archivos estáticos de Next.js.
 * - `favicon.ico` y `assets/`      → recursos públicos sin restricción.
 * - `login` y `register`           → tratados explícitamente en la función.
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|login|register).*)'],
};
