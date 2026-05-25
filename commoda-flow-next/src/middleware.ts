import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

export const config = {
  // Asegúrate de que los archivos estáticos y assets nunca pasen por el middleware
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)'], 
};