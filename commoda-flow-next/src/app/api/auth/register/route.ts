import { NextResponse } from 'next/server';
import { UserService } from '../../../../services/user.service'; // Tu servicio existente
import { registerSchema } from '../../../../schemas/user.schema';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validar con Zod
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    const { name, email, password } = result.data;

    // 2. Verificar si el usuario ya existe
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return NextResponse.json({ message: 'El correo ya está registrado' }, { status: 400 });
    }

    // 3. Encriptar contraseña y crear
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await UserService.create({
      name,
      email,
      password: hashedPassword,
      role: 'USER' // Asignar rol por defecto
    });

    return NextResponse.json({ 
      message: 'Cuenta creada con éxito', 
      user: { id: newUser.id, name: newUser.name, email: newUser.email } 
    }, { status: 201 });

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}