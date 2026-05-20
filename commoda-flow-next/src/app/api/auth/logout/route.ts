import { NextResponse } from 'next/server';

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