import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('token-commoda')?.value;
  const { pathname } = request.nextUrl;

  // 1. IMPORTANTE: Si el usuario ya tiene token y está en /login, 
  // lo mandamos a la página principal para evitar que se loguee dos veces.
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Si NO tiene token y NO está en la página de login,
  // lo mandamos a /login.
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto:
     * - api (rutas de backend)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};