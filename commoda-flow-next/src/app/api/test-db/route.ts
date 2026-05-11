import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await prisma.$connect()
    return NextResponse.json({ status: 'Conexión a Neon OK ✅' })
  } catch (error) {
    return NextResponse.json(
      { status: 'Error de conexión ❌', error: String(error) },
      { status: 500 }
    )
  }
}