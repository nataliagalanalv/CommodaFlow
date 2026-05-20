import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('token-commoda')?.value;
  const { pathname } = request.nextUrl;

  // Si no hay token y no es el login, redirigir al login
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si hay token y quiere ir al login, redirigir al inicio
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// La configuración se mantiene igual
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};