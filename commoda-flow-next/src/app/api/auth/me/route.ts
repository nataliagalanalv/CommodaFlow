import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { UserService } from '../../../../services/user.service';

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('token-commoda')?.value;

  if (!userId) return NextResponse.json({ user: null }, { status: 401 });

  const user = await UserService.getById(userId); // Crea este método en tu service
  return NextResponse.json({ user });
}